import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { Link } from "react-router-dom";
import {
  Cpu,
  Layers,
  Rocket,
  Sparkles,
  Timer,
  Wallet,
  Landmark,
} from "lucide-react";
import { GlassPanel } from "../components/GlassPanel.jsx";
import { StatCard } from "../components/StatCard.jsx";
import {
  bookingTrends,
  revenueSeries,
} from "../data/mockAdminData.js";
import { useLivePulse } from "../hooks/useLivePulse.js";
import { useAdminData } from "../context/AdminDataContext.jsx";

const gold = "#D4AF37";
const goldMuted = "#C8A962";

export function AdminOverview() {
  const [range, setRange] = useState("30d");
  const { dashboardStats, activityLog } = useAdminData();
  const liveOnline = useLivePulse(dashboardStats.onlineNow);
  const liveStats = useMemo(
    () => ({ ...dashboardStats, onlineNow: liveOnline }),
    [dashboardStats, liveOnline]
  );

  const cardConfig = [
    {
      label: "Showcase atlas",
      value: liveStats.totalProfiles,
      icon: Layers,
      trend: 11.4,
      neon: true,
    },
    {
      label: "Live storefront rows",
      value: liveStats.activeProfiles,
      icon: Cpu,
      trend: 6.8,
      neon: true,
    },
    {
      label: "Booking queue",
      value: liveStats.pendingBookings,
      icon: Timer,
      trend: liveStats.pendingBookings > 5 ? -3.2 : 4.1,
      neon: false,
    },
    {
      label: "Estimated MRR",
      value: Math.round(liveStats.monthlyRevenue / 1000),
      prefix: "$",
      suffix: "k",
      icon: Wallet,
      trend: liveStats.revenueChangePct,
      neon: true,
    },
  ];

  const chartRangeLabel = range === "7d" ? "Last 7 days" : range === "30d" ? "Last 30 days" : "Last 90 days";

  return (
    <div className="space-y-8 pb-24">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p className="text-[11px] uppercase tracking-[0.42em] text-amber-500/80 font-semibold">
          Companion operations
        </p>
        <h1 className="mt-2 text-4xl md:text-[2.65rem] font-semibold tracking-tight text-white">
          Night pulse <span className="text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-700 bg-clip-text">
            command grid
          </span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400 leading-relaxed">
          Premium concierge telemetry with glass panels, luminous analytics, and live moderation pulses — demo data seeded for cinematic UX validation.
        </p>
      </motion.div>

      <div className="flex gap-3 flex-wrap">
        {(["7d", "30d", "90d"]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setRange(k)}
            className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.25em] transition-all ${
              range === k
                ? "border-amber-400/40 bg-amber-500/10 text-amber-100 shadow-[0_0_26px_rgba(212,175,55,.2)]"
                : "border-white/10 bg-black/35 text-zinc-500 hover:text-white"
            }`}
          >
            {k === "90d" ? "90 DAYS" : k === "7d" ? "7 DAYS" : "30 DAYS"}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { to: '/admin/profiles', label: 'Profiles', Icon: Cpu },
          { to: '/admin/pricing', label: 'Pricing', Icon: Landmark },
          { to: '/admin/content', label: 'Content CMS', Icon: Sparkles },
          { to: '/admin/bookings', label: 'Bookings', Icon: Timer },
          { to: '/admin/media', label: 'Vault', Icon: Layers },
          { to: '/admin/vip', label: 'VIP', Icon: Rocket },
        ].map(({ to: path, label: lb, Icon: Ic }) => (
          <Link
            key={path}
            to={path}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-zinc-400 hover:border-amber-400/40 hover:text-amber-100 hover:shadow-[0_0_20px_rgba(212,175,55,.12)] transition-all"
          >
            <Ic className="h-3.5 w-3.5 text-amber-300" />
            {lb}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {cardConfig.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.45 }}
          >
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <GlassPanel hoverGlow className="xl:col-span-8 p-4 md:p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap pb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500 font-semibold">Bookings throughput</p>
              <p className="text-lg font-semibold text-white mt-1">{chartRangeLabel}</p>
            </div>
            <Sparkles className="h-5 w-5 text-amber-300" />
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingTrends} margin={{ left: -10, right: 4 }}>
                <defs>
                  <linearGradient id="gBook" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={gold} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={gold} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 12" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="day" stroke="#71717a" tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ stroke: `${gold}66` }}
                  contentStyle={{
                    background: "rgba(9, 9, 11, 0.95)",
                    border: "1px solid rgba(212,175,55,0.2)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Area type="monotone" dataKey="requests" strokeWidth={3} stroke={goldMuted} fill="url(#gBook)" name="Incoming" />
                <Area type="monotone" dataKey="confirmed" strokeWidth={2} stroke="#34d399" fill="rgba(52,211,153,0.12)" name="Confirmed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        <GlassPanel hoverGlow className="xl:col-span-4 p-4 md:p-6">
          <div className="flex items-start justify-between gap-3 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500 font-semibold">Live activity</p>
              <p className="text-lg font-semibold text-white mt-1">Operator stream</p>
            </div>
            <Cpu className="h-6 w-6 text-emerald-300" />
          </div>
          <motion.ul className="space-y-3 max-h-[20rem] overflow-y-auto">
            {activityLog.map((item, idx) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 backdrop-blur"
              >
                <p className="text-[11px] uppercase tracking-[0.25em] text-amber-500/85">{item.type}</p>
                <p className="text-sm text-white mt-1 font-medium">{item.actor}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{item.summary}</p>
                <p className="text-[11px] text-zinc-600 mt-1">{item.ts}</p>
              </motion.li>
            ))}
          </motion.ul>
        </GlassPanel>

        <GlassPanel hoverGlow className="xl:col-span-6 p-4 md:p-6">
          <div className="flex items-start justify-between gap-3 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500 font-semibold">Revenue glow</p>
              <p className="text-lg font-semibold text-white mt-1">Elite tiers</p>
            </div>
            <Landmark className="h-6 w-6 text-violet-300" />
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueSeries} barGap={14}>
                <CartesianGrid strokeDasharray="3 12" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="label" stroke="#71717a" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(9,9,11,.95)",
                    border: `1px solid ${goldMuted}66`,
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="revenue" name="Cash" radius={[14, 14, 6, 6]} fill="url(#gBarGold)" opacity={0.95} />
                <defs>
                  <linearGradient id="gBarGold" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#fef3c7" />
                    <stop offset="100%" stopColor="#b8860b" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        <GlassPanel hoverGlow className="xl:col-span-6 p-4 md:p-6">
          <div className="flex items-start justify-between gap-3 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500 font-semibold">Engagement halo</p>
              <p className="text-lg font-semibold text-white mt-1">Session sparkline</p>
            </div>
            <Sparkles className="h-6 w-6 text-pink-300" />
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingTrends} syncId="halo">
                <defs>
                  <linearGradient id="gHalo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#831843" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="6 14" stroke="rgba(255,255,255,0.04)" vertical />
                <XAxis dataKey="day" stroke="#71717a" tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "rgba(9,9,11,.95)",
                    border: "1px solid rgba(251,146,60,.35)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Area type="monotone" dataKey="confirmed" stroke="#fb923c" fill="url(#gHalo)" strokeWidth={4} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

