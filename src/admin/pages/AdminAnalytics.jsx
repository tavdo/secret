import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Tooltip as RTooltip,
} from 'recharts';
import { motion } from 'framer-motion';
import { GlassPanel } from '../components/GlassPanel.jsx';
import { useAdminToast } from '../context/ToastContext.jsx';
import { useAdminData } from '../context/AdminDataContext.jsx';

const GOLD = '#D4AF37';

export function AdminAnalytics() {
  const { toast } = useAdminToast();
  const { analytics, refreshAnalytics, dashboardStats, vipSubscriptions, bookings } =
    useAdminData();

  const bookingTrends = analytics?.bookingTrends?.length
    ? analytics.bookingTrends.map((d) => ({
        day: d.day?.slice(5) || d.day,
        confirmed: d.confirmed,
        total: d.total,
      }))
    : [];

  const userGrowth = analytics?.userGrowth?.length
    ? analytics.userGrowth.map((d) => ({
        week: d.week?.slice(5) || d.week,
        users: d.users,
      }))
    : [];

  const bookingsByStatus = (analytics?.bookingsByStatus || []).map((row) => ({
    status: row.status,
    count: row.count,
  }));

  const trafficMix = [
    { name: 'Users', value: analytics?.users ?? dashboardStats.totalUsers ?? 0 },
    { name: 'Providers', value: analytics?.providers ?? 0 },
    { name: 'VIP active', value: analytics?.vipActive ?? vipSubscriptions.filter((s) => s.status === 'active').length },
  ].filter((x) => x.value > 0);

  const revenueSeries = bookingTrends.map((d) => ({
    label: d.day,
    revenue: (d.confirmed || 0) * 120,
  }));

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold text-white tracking-tight">Signals studio</h1>
          <p className="text-sm text-zinc-500 mt-2">
            Live snapshot — {analytics?.users ?? '—'} users · {analytics?.providers ?? '—'} providers ·{' '}
            {analytics?.unreadReports ?? 0} open reports · {bookings.length} bookings loaded.
          </p>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            void refreshAnalytics();
            toast({ title: 'Analytics refreshed', variant: 'success' });
          }}
          className="rounded-xl border border-amber-500/35 px-5 py-2 text-xs uppercase tracking-[0.2em]"
        >
          Refresh
        </motion.button>
      </div>

      <div className="grid xl:grid-cols-12 gap-6">
        <GlassPanel hoverGlow className="xl:col-span-7 p-6 h-[360px]">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-2">Booking volume (30d)</p>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={revenueSeries.length ? revenueSeries : [{ label: '—', revenue: 0 }]} margin={{ top: 14, bottom: -6 }}>
              <defs>
                <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GOLD} stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 16" stroke="rgba(255,255,255,0.04)" vertical />
              <XAxis dataKey="label" stroke="#71717a" tickLine={false} />
              <YAxis stroke="#71717a" />
              <Tooltip
                contentStyle={{
                  background: 'rgba(7,7,11,.95)',
                  border: `1px solid ${GOLD}55`,
                  borderRadius: 12,
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#fef3c7" fill="url(#revFill)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassPanel>

        <GlassPanel hoverGlow className="xl:col-span-5 p-6 h-[360px]">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-2">New users (30d)</p>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={userGrowth.length ? userGrowth : [{ week: '—', users: 0 }]}>
              <CartesianGrid strokeDasharray="8 14" stroke="rgba(255,255,255,0.04)" vertical />
              <Legend />
              <XAxis dataKey="week" stroke="#71717a" tickLine={false} />
              <YAxis stroke="#71717a" />
              <Tooltip
                contentStyle={{
                  background: 'rgba(7,7,11,.94)',
                  border: '1px solid rgba(251,207,232,.35)',
                  borderRadius: 12,
                }}
              />
              <Line type="monotone" dot={{ r: 4 }} dataKey="users" stroke="#f472b6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </GlassPanel>

        <GlassPanel hoverGlow className="xl:col-span-4 p-6 h-[340px]">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-2">Bookings by status</p>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={bookingsByStatus.length ? bookingsByStatus : [{ status: 'NONE', count: 0 }]}
              layout="vertical"
              margin={{ left: 52, top: 6, bottom: 6 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="4 12" stroke="rgba(255,255,255,0.04)" />
              <XAxis type="number" stroke="#71717a" />
              <YAxis type="category" dataKey="status" stroke="#71717a" width={88} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(7,7,11,.93)',
                  border: `1px solid ${GOLD}44`,
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="count" radius={[0, 10, 10, 0]} fill={GOLD} />
            </BarChart>
          </ResponsiveContainer>
        </GlassPanel>

        <GlassPanel hoverGlow className="xl:col-span-4 p-6 h-[340px]">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-2">Audience mix</p>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={trafficMix.length ? trafficMix : [{ name: 'Empty', value: 1 }]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="52%"
                outerRadius={102}
                stroke="#09090b"
                strokeWidth={3}
              >
                {(trafficMix.length ? trafficMix : [{ name: 'Empty', value: 1 }]).map((_, i) => (
                  <Cell key={`t-${i}`} fill={['#fcd34d', '#f472b6', '#818cf8'][i % 3]} />
                ))}
              </Pie>
              <RTooltip />
            </PieChart>
          </ResponsiveContainer>
        </GlassPanel>

        <GlassPanel hoverGlow className="xl:col-span-4 p-6 h-[340px]">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-2">Confirmed bookings</p>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={bookingTrends.length ? bookingTrends : [{ day: '—', confirmed: 0 }]}>
              <Legend />
              <XAxis dataKey="day" stroke="#71717a" tickLine={false} />
              <YAxis stroke="#71717a" />
              <Line type="monotone" strokeWidth={2} stroke={GOLD} dataKey="confirmed" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </GlassPanel>
      </div>
    </div>
  );
}
