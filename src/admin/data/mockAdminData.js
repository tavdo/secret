/** Realistic fixture data — replace with Axios / WebSocket integrations. */

export const statsOverview = {
  totalUsers: 18420,
  activeProfiles: 3124,
  onlineNow: 487,
  monthlyRevenue: 428900,
  revenueChangePct: 12.4,
  bookingsWeek: 842,
  bookingsChangePct: 6.8,
  pendingReports: 23,
  pendingModerations: 18,
};

export const revenueSeries = [
  { label: 'Jan', revenue: 320000, subs: 120 },
  { label: 'Feb', revenue: 355000, subs: 132 },
  { label: 'Mar', revenue: 380000, subs: 141 },
  { label: 'Apr', revenue: 401000, subs: 155 },
  { label: 'May', revenue: 415000, subs: 168 },
  { label: 'Jun', revenue: 428900, subs: 182 },
];

export const userGrowth = [
  { week: 'W1', users: 12400 },
  { week: 'W2', users: 13620 },
  { week: 'W3', users: 15210 },
  { week: 'W4', users: 16840 },
  { week: 'W5', users: 17320 },
  { week: 'W6', users: 18420 },
];

export const bookingTrends = [
  { day: 'Mon', requests: 42, confirmed: 28 },
  { day: 'Tue', requests: 38, confirmed: 31 },
  { day: 'Wed', requests: 55, confirmed: 40 },
  { day: 'Thu', requests: 48, confirmed: 35 },
  { day: 'Fri', requests: 71, confirmed: 52 },
  { day: 'Sat', requests: 88, confirmed: 64 },
  { day: 'Sun', requests: 63, confirmed: 45 },
];

export const trafficMix = [
  { name: 'Mobile', value: 58 },
  { name: 'Desktop', value: 32 },
  { name: 'Tablet', value: 10 },
];

export const activityFeed = [
  { id: '1', type: 'verify', actor: '@aurora_lane', summary: 'Profile verification queued', ts: '2 min ago', glow: 'gold' },
  { id: '2', type: 'booking', actor: '#BK-8492', summary: 'High-value booking request — Miami', ts: '6 min ago', glow: 'emerald' },
  { id: '3', type: 'alert', actor: 'Trust & Safety', summary: 'Spam cluster flagged ID-22F', ts: '12 min ago', glow: 'rose' },
  { id: '4', type: 'vip', actor: 'Elite Tier', summary: 'Auto-renewal batch processed', ts: '24 min ago', glow: 'violet' },
  { id: '5', type: 'user', actor: '_velvetNova', summary: 'Session anomaly — geo jump', ts: '31 min ago', glow: 'amber' },
  { id: '6', type: 'booking', actor: '#BK-8477', summary: 'Dispute escalation opened', ts: '45 min ago', glow: 'cyan' },
];

export const moderationQueue = [
  {
    id: 'mod-101',
    name: 'Elena Laurent',
    city: 'Miami',
    submitted: '2026-05-10',
    avatar: null,
    status: 'pending',
    riskScore: 0.21,
    images: ['/img1.jpg', '/img2.jpg'],
  },
  {
    id: 'mod-102',
    name: 'Sienna Rowe',
    city: 'Dubai',
    submitted: '2026-05-10',
    status: 'pending',
    riskScore: 0.44,
    images: ['/a.jpg'],
  },
  {
    id: 'mod-103',
    name: 'Noir Ashton',
    city: 'Paris',
    submitted: '2026-05-09',
    status: 'needs_review',
    riskScore: 0.76,
    images: ['/x.jpg'],
  },
];

export const users = Array.from({ length: 52 }).map((_, i) => ({
  id: `usr-${8400 + i}`,
  handle: `@client_${8400 + i}`,
  email: `user${8400 + i}@mail.demo`,
  role: i % 7 === 0 ? 'ADMIN' : i % 3 === 0 ? 'PROVIDER' : 'USER',
  status: i % 11 === 0 ? 'SUSPENDED' : i % 19 === 0 ? 'BANNED' : 'ACTIVE',
  verified: i % 4 !== 0,
  vipBadge: i % 5 === 0,
  lastActive: i % 2 === 0 ? 'Online now' : `${(i % 48) + 1}h ago`,
  bookings: Math.floor(((i * 17) % 40) + 1),
  spend: Math.floor(((i * 937) % 12000) + 600),
}));

export const bookingsAdmin = Array.from({ length: 42 }).map((_, i) => ({
  id: `BK-${8800 + i}`,
  client: `@guest_${740 + i}`,
  provider: `@pro_${920 + i}`,
  city: ['Miami', 'NYC', 'LA', 'LON', 'DUB'][i % 5],
  status: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'][i % 4],
  value: 420 + ((i * 137) % 3200),
  starts: `2026-05-${((i % 18) + 10).toString().padStart(2, '0')} 21:30`,
}));

export const reportsSafety = Array.from({ length: 36 }).map((_, i) => ({
  id: `RPT-${300 + i}`,
  category: ['Abuse', 'Scam suspicion', 'Impersonation', 'Spam'][i % 4],
  subject: `@target_${910 + i}`,
  reporter: `@reporter_${210 + i}`,
  status: ['OPEN', 'IN_REVIEW', 'RESOLVED', 'DISMISSED'][i % 4],
  priority: ['LOW', 'MED', 'HIGH', 'URGENT'][i % 7 === 0 ? 3 : i % 3],
  created: `2026-05-${((i % 12) + 1).toString().padStart(2, '0')}`,
}));

export const vipSubscriptions = Array.from({ length: 28 }).map((_, i) => ({
  id: `VIP-${500 + i}`,
  memberHandle: `@vip_${760 + i}`,
  plan: ['Elite', 'Platinum', 'Founders'][i % 3],
  mrr: 199 + ((i % 5) * 40),
  since: `2026-01-${((i % 26) + 1).toString().padStart(2, '0')}`,
  renewsIn: `${(i % 27) + 1} days`,
  status: i % 9 === 0 ? 'paused' : 'active',
}));

export const chatAlerts = [
  {
    id: 'ca1',
    room: 'THREAD-9281',
    users: '@velvetNova ↔ @silverline',
    risk: 'HIGH',
    reason: 'Rapid solicitation pattern detected',
    flags: ['keyword burst', 'off-platform pivot'],
    ts: '8 min ago',
  },
  {
    id: 'ca2',
    room: 'THREAD-9133',
    users: '@luna ⚡ @_echo',
    risk: 'MED',
    reason: 'Possible spam carousel',
    flags: ['repeated canned messages'],
    ts: '18 min ago',
  },
];

export const deviceStats = [
  { device: 'iOS', sessions: 54 },
  { device: 'Android', sessions: 31 },
  { device: 'Web', sessions: 15 },
];
