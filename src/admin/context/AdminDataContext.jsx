import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createProfileRemote,
  createVipSubscriptionRemote,
  deleteProfileRemote,
  fetchAnalyticsRemote,
  fetchBookingsRemote,
  fetchProfilesRemote,
  fetchReportsRemote,
  fetchUsersRemote,
  fetchVipSubscriptionsRemote,
  persistProfileRemote,
  setBookingStatusRemote,
  setUserStatusRemote,
  updateReportRemote,
  updateVipSubscriptionRemote,
} from '../api/adminApi.js';

const STORAGE_KEY = 'secret-admin-plane-v2';

const DEFAULT_VIP_TIERS = [
  {
    id: 'tier-gold',
    name: 'Gold',
    monthlyPrice: 249,
    perks: ['VIP badge'],
    spotlight: true,
    sortOrder: 0,
  },
  {
    id: 'tier-platinum',
    name: 'Platinum',
    monthlyPrice: 399,
    perks: ['VIP badge', 'Featured'],
    spotlight: true,
    sortOrder: 1,
  },
  {
    id: 'tier-elite',
    name: 'Elite',
    monthlyPrice: 599,
    perks: ['VIP badge', 'Featured', 'Priority'],
    spotlight: false,
    sortOrder: 2,
  },
];

const genId = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 9999)}`;

function safeParse(raw) {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function mapUserRow(u) {
  return {
    id: u.id,
    handle: u.profile?.displayName || u.profile?.slug || (u.email || '').split('@')[0] || u.id,
    email: u.email || '',
    role: u.role || 'USER',
    status: u.accountStatus || 'ACTIVE',
    vipBadge: false,
    spend: 0,
    bookings: 0,
    lastActive: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '',
  };
}

function mapBookingRow(b) {
  return {
    id: b.id,
    client: b.client?.profile?.displayName || b.client?.email || 'Client',
    provider: b.provider?.profile?.displayName || b.provider?.email || 'Provider',
    city: b.provider?.profile?.city || b.client?.profile?.city || 'Batumi',
    status: b.status,
    value: Number(b.provider?.profile?.priceMin || 0),
    starts: b.startsAt ? new Date(b.startsAt).toLocaleString() : '',
  };
}

function mapVipSub(s, tiers) {
  const plan = s.planName || 'Gold';
  const tier = tiers.find((t) => t.name === plan);
  const until = s.validUntil ? new Date(s.validUntil) : null;
  const days = until ? Math.ceil((until.getTime() - Date.now()) / 86400000) : 0;
  return {
    id: s.id,
    plan,
    memberHandle: s.profile?.displayName || s.profile?.slug || s.profileId,
    profileId: s.profileId,
    mrr: Number(tier?.monthlyPrice || 0),
    renewsIn: days > 0 ? `${days}d` : 'expired',
    status: s.active ? 'active' : 'paused',
  };
}

function mapReportRow(r) {
  return {
    id: r.id,
    category: r.category || 'GENERAL',
    subject: r.subject?.email || '—',
    reporter: r.reporter?.email || '—',
    priority: r.status === 'OPEN' ? 'HIGH' : r.status === 'IN_REVIEW' ? 'URGENT' : 'NORMAL',
    created: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
    status: r.status,
    description: r.description || '',
  };
}

const AdminDataContext = createContext(null);

/* eslint-disable react-refresh/only-export-components -- context module exports provider + hook */
export function AdminDataProvider({ children }) {
  const stored =
    typeof sessionStorage !== 'undefined' ? safeParse(sessionStorage.getItem(STORAGE_KEY)) : null;

  const [profiles, setProfiles] = useState([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [profilesError, setProfilesError] = useState('');
  const [bookings, setBookings] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [vipTiers, setVipTiers] = useState(() =>
    stored?.vipTiers?.length ? stored.vipTiers : DEFAULT_VIP_TIERS
  );
  const [vipSubscriptions, setVipSubscriptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [mediaLibrary, setMediaLibrary] = useState(() => stored?.mediaLibrary ?? []);
  const [activityLog, setActivityLog] = useState(() => stored?.activityLog ?? []);

  const persist = useCallback((snap) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
    } catch {
      /* ignore quota */
    }
  }, []);

  useEffect(() => {
    persist({ vipTiers, mediaLibrary, activityLog });
  }, [persist, vipTiers, mediaLibrary, activityLog]);

  const pushActivity = useCallback((type, actor, summary) => {
    setActivityLog((prev) =>
      [{ id: genId('evt'), type, actor, summary, ts: 'just now' }, ...prev].slice(0, 80)
    );
  }, []);

  const refreshProfiles = useCallback(async () => {
    setProfilesLoading(true);
    setProfilesError('');
    try {
      const data = await fetchProfilesRemote();
      setProfiles(Array.isArray(data?.items) ? data.items : []);
    } catch (err) {
      setProfilesError(
        err?.response?.data?.error || err?.message || 'პროფილების ჩატვირთვა ვერ მოხერხდა'
      );
      setProfiles([]);
    } finally {
      setProfilesLoading(false);
    }
  }, []);

  const refreshUsers = useCallback(async () => {
    try {
      const data = await fetchUsersRemote();
      setUsersList(Array.isArray(data?.items) ? data.items.map(mapUserRow) : []);
    } catch {
      /* keep previous */
    }
  }, []);

  const refreshBookings = useCallback(async () => {
    try {
      const data = await fetchBookingsRemote();
      setBookings(Array.isArray(data?.items) ? data.items.map(mapBookingRow) : []);
    } catch {
      /* keep previous */
    }
  }, []);

  const refreshVip = useCallback(async () => {
    try {
      const data = await fetchVipSubscriptionsRemote();
      const items = Array.isArray(data?.items) ? data.items : [];
      const tiers = vipTiers.length ? vipTiers : DEFAULT_VIP_TIERS;
      setVipSubscriptions(items.map((s) => mapVipSub(s, tiers)));
    } catch {
      /* keep previous */
    }
  }, [vipTiers]);

  const refreshReports = useCallback(async () => {
    try {
      const data = await fetchReportsRemote();
      const rows = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      setReports(rows.map(mapReportRow));
    } catch {
      /* keep previous */
    }
  }, []);

  const refreshAnalytics = useCallback(async () => {
    try {
      setAnalytics(await fetchAnalyticsRemote());
    } catch {
      /* keep previous */
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void refreshProfiles();
      void refreshUsers();
      void refreshBookings();
      void refreshVip();
      void refreshReports();
      void refreshAnalytics();
    }, 0);
    return () => clearTimeout(timer);
  }, [
    refreshProfiles,
    refreshUsers,
    refreshBookings,
    refreshVip,
    refreshReports,
    refreshAnalytics,
  ]);

  const addProfile = useCallback(
    async (payload) => {
      const gallery = Array.isArray(payload.gallery)
        ? payload.gallery.filter((u) => typeof u === 'string' && /^https?:\/\//i.test(u))
        : [];
      const avatarRaw = payload.avatar || gallery[0] || '';
      const avatar = /^https?:\/\//i.test(avatarRaw) ? avatarRaw : '';

      const body = {
        displayName: payload.displayName,
        handle: payload.handle || undefined,
        age: payload.age,
        city: payload.city || 'Batumi',
        phone: payload.phone?.trim() || undefined,
        bio: payload.bio || '',
        servicesText: payload.servicesText || undefined,
        hourlyRate: payload.hourlyRate,
        available: payload.available !== false,
        hidden: Boolean(payload.hidden),
        featured: Boolean(payload.featured),
        gallery,
      };
      if (payload.email?.trim()) body.email = payload.email.trim();
      if (payload.password?.trim() && payload.password.trim().length >= 10) {
        body.password = payload.password.trim();
      }
      if (avatar) body.avatar = avatar;

      const row = await createProfileRemote(body);
      setProfiles((prev) => [row, ...prev]);
      pushActivity('profiles', row.displayName, 'New showcase published via control tower');
      return row.id;
    },
    [pushActivity]
  );

  const updateProfile = useCallback(
    async (id, patch) => {
      const next = { ...patch };
      if (Array.isArray(next.gallery)) {
        next.gallery = next.gallery.filter(
          (u) => typeof u === 'string' && /^https?:\/\//i.test(u)
        );
      }
      if (typeof next.avatar === 'string' && next.avatar && !/^https?:\/\//i.test(next.avatar)) {
        delete next.avatar;
      }
      const row = await persistProfileRemote(id, next);
      setProfiles((prev) => prev.map((p) => (p.id === id ? row : p)));
      pushActivity('profiles', row.handle || id, 'Profile matrix updated');
      return row;
    },
    [pushActivity]
  );

  const deleteProfile = useCallback(
    async (id) => {
      await deleteProfileRemote(id);
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      setMediaLibrary((prev) => prev.filter((m) => m.profileId !== id));
      pushActivity('profiles', id, 'Profile revoked from storefront');
    },
    [pushActivity]
  );

  const reorderProfileGallery = useCallback((profileId, from, to) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== profileId) return p;
        const g = [...p.gallery];
        const [mv] = g.splice(from, 1);
        g.splice(to, 0, mv);
        return { ...p, gallery: g };
      })
    );
  }, []);

  const setBookingStatus = useCallback(
    async (id, status) => {
      await setBookingStatusRemote(id, status);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      pushActivity('booking', `#${id}`, `Status transitioned → ${status}`);
      void refreshAnalytics();
    },
    [pushActivity, refreshAnalytics]
  );

  const banUser = useCallback(
    async (id) => {
      await setUserStatusRemote(id, 'BANNED');
      setUsersList((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'BANNED' } : u)));
      pushActivity('user', id, 'Account barred');
    },
    [pushActivity]
  );

  const unbanUser = useCallback(
    async (id) => {
      await setUserStatusRemote(id, 'ACTIVE');
      setUsersList((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'ACTIVE' } : u)));
      pushActivity('user', id, 'Account reinstated');
    },
    [pushActivity]
  );

  const suspendUser = useCallback(
    async (id) => {
      await setUserStatusRemote(id, 'SUSPENDED');
      setUsersList((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: 'SUSPENDED' } : u))
      );
      pushActivity('user', id, 'Hold applied');
    },
    [pushActivity]
  );

  const resetUserStatus = useCallback(
    async (id) => {
      await setUserStatusRemote(id, 'ACTIVE');
      setUsersList((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'ACTIVE' } : u)));
      pushActivity('user', id, 'Account cleared to active status');
    },
    [pushActivity]
  );

  const upsertVipTier = useCallback(
    (row) => {
      setVipTiers((prev) => {
        const ix = prev.findIndex((t) => t.id === row.id);
        if (ix === -1) return [...prev, { ...row, id: row.id || genId('tier') }];
        const clone = [...prev];
        clone[ix] = { ...clone[ix], ...row };
        return clone.sort((a, b) => a.sortOrder - b.sortOrder);
      });
      pushActivity('vip', row.name, 'Tier topology saved');
    },
    [pushActivity]
  );

  const deleteVipTier = useCallback(
    (id) => {
      setVipTiers((prev) => prev.filter((t) => t.id !== id));
      pushActivity('vip', id, 'Tier retired');
    },
    [pushActivity]
  );

  const toggleVipSubStatus = useCallback(
    async (id, next) => {
      const active = next === 'active';
      await updateVipSubscriptionRemote(id, { active });
      setVipSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: active ? 'active' : 'paused' } : s))
      );
      pushActivity('vip', id, active ? 'Subscription resumed' : 'Subscription paused');
      void refreshProfiles();
    },
    [pushActivity, refreshProfiles]
  );

  const assignSubscriptionPlan = useCallback(
    async (id, plan) => {
      await updateVipSubscriptionRemote(id, { planName: plan });
      const tier = vipTiers.find((t) => t.name === plan);
      setVipSubscriptions((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, plan, mrr: Number(tier?.monthlyPrice || s.mrr || 0) } : s
        )
      );
      pushActivity('vip', id, `Plan rewired → ${plan}`);
    },
    [pushActivity, vipTiers]
  );

  const grantVipSubscription = useCallback(
    async (profileId, { planName = 'Gold', months = 1 } = {}) => {
      const created = await createVipSubscriptionRemote(profileId, { planName, months });
      setVipSubscriptions((prev) => [mapVipSub(created, vipTiers), ...prev]);
      await refreshProfiles();
      pushActivity('vip', profileId, `VIP ${planName} granted`);
      return created;
    },
    [pushActivity, refreshProfiles, vipTiers]
  );

  const toggleProfileVip = useCallback(async (id, vipFlag) => {
    const row = await persistProfileRemote(id, { vip: vipFlag });
    setProfiles((prev) => prev.map((p) => (p.id === id ? row : p)));
    if (vipFlag) {
      const existing = vipSubscriptions.find((s) => s.profileId === id && s.status === 'active');
      if (!existing) {
        try {
          await createVipSubscriptionRemote(id, { planName: vipTiers[0]?.name || 'Gold', months: 1 });
          await refreshVip();
        } catch {
          /* badge already set */
        }
      }
    }
  }, [refreshVip, vipSubscriptions, vipTiers]);

  const resolveReport = useCallback(
    async (id, status = 'RESOLVED') => {
      await updateReportRemote(id, { status });
      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      pushActivity('reports', id, `Report → ${status}`);
      void refreshAnalytics();
    },
    [pushActivity, refreshAnalytics]
  );

  const addMedia = useCallback(
    async ({ url, profileId, label }) => {
      if (!url || !/^https?:\/\//i.test(url)) {
        throw new Error('HTTPS image URL required');
      }
      const id = genId('media');
      setMediaLibrary((prev) => [
        {
          id,
          profileId,
          url,
          label: label || 'Uploaded asset',
          uploadedAt: new Date().toISOString().slice(0, 10),
          type: 'image',
        },
        ...prev,
      ]);
      if (profileId) {
        const profile = profiles.find((p) => p.id === profileId);
        const gallery = [...(profile?.gallery || []), url].filter(
          (u, i, arr) => typeof u === 'string' && /^https?:\/\//i.test(u) && arr.indexOf(u) === i
        );
        const avatar =
          profile?.avatar && /^https?:\/\//i.test(profile.avatar) ? profile.avatar : gallery[0];
        try {
          const row = await persistProfileRemote(profileId, { gallery, avatar });
          setProfiles((prev) => prev.map((p) => (p.id === profileId ? row : p)));
        } catch {
          /* local media entry kept */
        }
      }
      return id;
    },
    [profiles]
  );

  const deleteMediaById = useCallback(
    async (mediaId) => {
      const target = mediaLibrary.find((m) => m.id === mediaId);
      setMediaLibrary((prev) => prev.filter((m) => m.id !== mediaId));
      if (target?.url && target.profileId) {
        const profile = profiles.find((p) => p.id === target.profileId);
        if (profile) {
          const gallery = (profile.gallery || []).filter((u) => u !== target.url);
          const avatar = profile.avatar === target.url ? gallery[0] || '' : profile.avatar;
          try {
            const row = await persistProfileRemote(profile.id, { gallery, avatar });
            setProfiles((prev) => prev.map((p) => (p.id === profile.id ? row : p)));
          } catch {
            setProfiles((prev) =>
              prev.map((p) =>
                p.id !== profile.id
                  ? p
                  : {
                      ...p,
                      avatar: p.avatar === target.url ? '' : p.avatar,
                      gallery: (p.gallery || []).filter((u) => u !== target.url),
                    }
              )
            );
          }
        }
      }
      pushActivity('media', mediaId, 'Asset scrubbed');
    },
    [mediaLibrary, profiles, pushActivity]
  );

  const replaceProfileAvatar = useCallback(async (profileId, url) => {
    if (!url || !/^https?:\/\//i.test(url)) return;
    try {
      const row = await persistProfileRemote(profileId, { avatar: url });
      setProfiles((prev) => prev.map((p) => (p.id === profileId ? row : p)));
    } catch {
      setProfiles((prev) =>
        prev.map((p) => (p.id === profileId ? { ...p, avatar: url } : p))
      );
    }
  }, []);

  const dashboardStats = useMemo(() => {
    const totalProfiles = profiles.length;
    const activePublic = profiles.filter((p) => !p.hidden).length;
    const onlineShowcases = profiles.filter((p) => p.available && !p.hidden).length;
    const pendingBookings = bookings.filter((b) => b.status === 'PENDING').length;
    const confirmedValue = bookings
      .filter((b) => b.status === 'COMPLETED' || b.status === 'ACCEPTED')
      .reduce((s, b) => s + (Number(b.value) || 0), 0);
    const vipMrr = vipSubscriptions
      .filter((s) => s.status === 'active')
      .reduce((s, b) => s + (Number(b.mrr) || 0), 0);
    return {
      totalUsers: analytics?.users ?? usersList.length,
      totalProfiles,
      activeProfiles: activePublic,
      onlineNow: onlineShowcases,
      monthlyRevenue: vipMrr || confirmedValue,
      revenueChangePct: 0,
      pendingBookings,
      openReports: analytics?.unreadReports ?? reports.filter((r) => r.status === 'OPEN').length,
    };
  }, [profiles, bookings, usersList.length, vipSubscriptions, analytics, reports]);

  const value = useMemo(
    () => ({
      profiles,
      profilesLoading,
      profilesError,
      refreshProfiles,
      bookings,
      refreshBookings,
      users: usersList,
      vipTiers,
      vipSubscriptions,
      refreshVip,
      reports,
      refreshReports,
      resolveReport,
      analytics,
      refreshAnalytics,
      mediaLibrary,
      activityLog,
      dashboardStats,
      addProfile,
      updateProfile,
      deleteProfile,
      reorderProfileGallery,
      setBookingStatus,
      banUser,
      unbanUser,
      suspendUser,
      resetUserStatus,
      upsertVipTier,
      deleteVipTier,
      toggleVipSubStatus,
      assignSubscriptionPlan,
      grantVipSubscription,
      toggleProfileVip,
      addMedia,
      deleteMediaById,
      replaceProfileAvatar,
      pushActivity,
    }),
    [
      profiles,
      profilesLoading,
      profilesError,
      refreshProfiles,
      bookings,
      refreshBookings,
      usersList,
      vipTiers,
      vipSubscriptions,
      refreshVip,
      reports,
      refreshReports,
      resolveReport,
      analytics,
      refreshAnalytics,
      mediaLibrary,
      activityLog,
      dashboardStats,
      addProfile,
      updateProfile,
      deleteProfile,
      reorderProfileGallery,
      setBookingStatus,
      banUser,
      unbanUser,
      suspendUser,
      resetUserStatus,
      upsertVipTier,
      deleteVipTier,
      toggleVipSubStatus,
      assignSubscriptionPlan,
      grantVipSubscription,
      toggleProfileVip,
      addMedia,
      deleteMediaById,
      replaceProfileAvatar,
      pushActivity,
    ]
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider');
  return ctx;
}
