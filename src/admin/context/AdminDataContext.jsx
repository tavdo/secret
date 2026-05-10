import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  bookingsAdmin,
  vipSubscriptions as vipSubsSeed,
  activityFeed as activitySeed,
  statsOverview as statsSeed,
  users as usersSeed,
} from '../data/mockAdminData.js';
import {
  seedMediaAssets,
  seedPricingPackages,
  seedProfiles,
  seedVipTiers,
} from '../data/controlPlaneSeed.js';

const STORAGE_KEY = 'secret-admin-plane-v1';

const genId = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 9999)}`;

/** @typedef {ReturnType<typeof seedProfiles>[number]} MarketplaceProfile */

const initialActivity = activitySeed.map((a) => ({
  id: a.id,
  type: a.type,
  actor: a.actor,
  summary: a.summary,
  ts: a.ts,
}));

function safeParse(raw) {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const AdminDataContext = createContext(null);

/* eslint-disable react-refresh/only-export-components -- context module exports provider + hook */
export function AdminDataProvider({ children }) {
  const stored = typeof sessionStorage !== 'undefined' ? safeParse(sessionStorage.getItem(STORAGE_KEY)) : null;

  const [profiles, setProfiles] = useState(
    () => stored?.profiles ?? seedProfiles().map((p) => structuredClone(p))
  );
  const [bookings, setBookings] = useState(
    () =>
      stored?.bookings ??
      bookingsAdmin.map((b) => ({ ...b }))
  );
  const [usersList, setUsersList] = useState(
    () => stored?.usersList ?? usersSeed.map((u) => ({ ...u }))
  );
  const [pricingPackages, setPricingPackages] = useState(
    () => stored?.pricingPackages ?? seedPricingPackages()
  );
  const [vipTiers, setVipTiers] = useState(() => stored?.vipTiers ?? seedVipTiers());
  const [vipSubscriptions, setVipSubscriptions] = useState(
    () => stored?.vipSubscriptions ?? vipSubsSeed.map((v) => ({ ...v }))
  );
  const [mediaLibrary, setMediaLibrary] = useState(() => {
    if (stored?.mediaLibrary?.length) return stored.mediaLibrary;
    return seedMediaAssets();
  });
  const [activityLog, setActivityLog] = useState(() => stored?.activityLog ?? initialActivity);

  const persist = useCallback(
    (snap) => {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
      } catch {
        /* ignore quota */
      }
    },
    []
  );

  useEffect(() => {
    persist({
      profiles,
      bookings,
      usersList,
      pricingPackages,
      vipTiers,
      vipSubscriptions,
      mediaLibrary,
      activityLog,
    });
  }, [
    persist,
    profiles,
    bookings,
    usersList,
    pricingPackages,
    vipTiers,
    vipSubscriptions,
    mediaLibrary,
    activityLog,
  ]);

  const pushActivity = useCallback((type, actor, summary) => {
    setActivityLog((prev) =>
      [{ id: genId('evt'), type, actor, summary, ts: 'just now' }, ...prev].slice(0, 80)
    );
  }, []);

  const addProfile = useCallback((payload) => {
    const id = genId('prof');
    const row = {
      id,
      displayName: payload.displayName,
      handle:
        payload.handle?.trim() ||
        `@${payload.displayName.toLowerCase().replace(/\s+/g, '_')}`,
      age: payload.age ?? 25,
      city: payload.city ?? 'TBD',
      bio: payload.bio ?? '<p>New profile biography.</p>',
      hourlyRate: payload.hourlyRate ?? 650,
      vip: Boolean(payload.vip),
      available: payload.available !== false,
      hidden: Boolean(payload.hidden),
      featured: Boolean(payload.featured),
      avatar: payload.avatar ?? '',
      gallery: Array.isArray(payload.gallery) ? payload.gallery : [],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      sortOrder: profiles.length,
    };
    setProfiles((p) => [...p, row]);
    pushActivity('profiles', payload.displayName, 'New showcase published via control tower');
    return id;
  }, [profiles.length, pushActivity]);

  const updateProfile = useCallback((id, patch) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString().slice(0, 10) } : p
      )
    );
    pushActivity('profiles', `@${patch.displayName ?? id}`, 'Profile matrix updated');
  }, [pushActivity]);

  const deleteProfile = useCallback((id) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    setMediaLibrary((prev) => prev.filter((m) => m.profileId !== id));
    pushActivity('profiles', id, 'Profile revoked from storefront');
  }, [pushActivity]);

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
    (id, status) => {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      pushActivity('booking', `#${id}`, `Status transitioned → ${status}`);
    },
    [pushActivity]
  );

  const banUser = useCallback((id) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: 'BANNED' } : u))
    );
    pushActivity('user', id, 'Account barred');
  }, [pushActivity]);

  const unbanUser = useCallback((id) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'BANNED' ? 'ACTIVE' : u.status } : u
      )
    );
    pushActivity('user', id, 'Account reinstated');
  }, [pushActivity]);

  const suspendUser = useCallback((id) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status !== 'BANNED' ? 'SUSPENDED' : u.status } : u
      )
    );
    pushActivity('user', id, 'Hold applied');
  }, [pushActivity]);

  const resetUserStatus = useCallback((id) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: 'ACTIVE' } : u))
    );
    pushActivity('user', id, 'Account cleared to active status');
  }, [pushActivity]);

  const upsertPricingPackage = useCallback(
    (row) => {
      setPricingPackages((prev) => {
        const ix = prev.findIndex((p) => p.id === row.id);
        if (ix === -1) return [...prev, { ...row, id: row.id || genId('pkg') }];
        const clone = [...prev];
        clone[ix] = { ...clone[ix], ...row };
        return clone;
      });
      pushActivity('pricing', row.name, 'Yield table adjusted');
    },
    [pushActivity]
  );

  const deletePricingPackage = useCallback((id) => {
    setPricingPackages((prev) => prev.filter((p) => p.id !== id));
    pushActivity('pricing', id, 'Package sunset');
  }, [pushActivity]);

  const upsertVipTier = useCallback((row) => {
    setVipTiers((prev) => {
      const ix = prev.findIndex((t) => t.id === row.id);
      if (ix === -1) return [...prev, { ...row, id: row.id || genId('tier') }];
      const clone = [...prev];
      clone[ix] = { ...clone[ix], ...row };
      return clone.sort((a, b) => a.sortOrder - b.sortOrder);
    });
    pushActivity('vip', row.name, 'Tier topology saved');
  }, [pushActivity]);

  const deleteVipTier = useCallback((id) => {
    setVipTiers((prev) => prev.filter((t) => t.id !== id));
    pushActivity('vip', id, 'Tier retired');
  }, [pushActivity]);

  const toggleVipSubStatus = useCallback((id, next) => {
    setVipSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: next } : s))
    );
  }, []);

  const assignSubscriptionPlan = useCallback((id, plan) => {
    setVipSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, plan } : s))
    );
    pushActivity('vip', id, `Plan rewired → ${plan}`);
  }, [pushActivity]);

  const toggleProfileVip = useCallback((id, vipFlag) => {
    setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, vip: vipFlag } : p)));
  }, []);

  const addMedia = useCallback(({ url, profileId, label }) => {
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
    return id;
  }, []);

  const deleteMediaById = useCallback(
    (mediaId) => {
      setMediaLibrary((prev) => {
        const target = prev.find((m) => m.id === mediaId);
        const next = prev.filter((m) => m.id !== mediaId);
        if (target?.url) {
          setProfiles((pList) =>
            pList.map((p) => ({
              ...p,
              avatar: p.avatar === target.url ? '' : p.avatar,
              gallery: p.gallery.filter((u) => u !== target.url),
            }))
          );
        }
        return next;
      });
      pushActivity('media', mediaId, 'Asset scrubbed');
    },
    [pushActivity]
  );

  const replaceProfileAvatar = useCallback((profileId, url) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === profileId ? { ...p, avatar: url } : p))
    );
  }, []);

  const dashboardStats = useMemo(() => {
    const totalProfiles = profiles.length;
    const activePublic = profiles.filter((p) => !p.hidden).length;
    const onlineShowcases = profiles.filter((p) => p.available && !p.hidden).length;
    const pendingBookings = bookings.filter((b) => b.status === 'PENDING').length;
    const confirmedValue = bookings
      .filter((b) => b.status === 'COMPLETED' || b.status === 'ACCEPTED')
      .reduce((s, b) => s + b.value, 0);
    const monthlyRevenue = Math.round(
      statsSeed.monthlyRevenue * 0.55 + confirmedValue * 12
    );
    return {
      totalUsers: usersList.length,
      totalProfiles,
      activeProfiles: activePublic,
      onlineNow: onlineShowcases,
      monthlyRevenue,
      revenueChangePct: statsSeed.revenueChangePct,
      pendingBookings,
    };
  }, [profiles, bookings, usersList.length]);

  const value = useMemo(
    () => ({
      profiles,
      bookings,
      users: usersList,
      pricingPackages,
      vipTiers,
      vipSubscriptions,
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
      upsertPricingPackage,
      deletePricingPackage,
      upsertVipTier,
      deleteVipTier,
      toggleVipSubStatus,
      assignSubscriptionPlan,
      toggleProfileVip,
      addMedia,
      deleteMediaById,
      replaceProfileAvatar,
      pushActivity,
    }),
    [
      profiles,
      bookings,
      usersList,
      pricingPackages,
      vipTiers,
      vipSubscriptions,
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
      upsertPricingPackage,
      deletePricingPackage,
      upsertVipTier,
      deleteVipTier,
      toggleVipSubStatus,
      assignSubscriptionPlan,
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