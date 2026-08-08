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
} from "recharts";
import { motion } from "framer-motion";
import { GlassPanel } from "../components/GlassPanel.jsx";
import { useAdminToast } from "../context/ToastContext.jsx";

const GOLD = '#D4AF37';
const revenueSeries = [];
const userGrowth = [];
const trafficMix = [];
const deviceStats = [];
const bookingTrends = [];

export function AdminAnalytics() {
  const { toast } = useAdminToast();
  return (
    <div className="space-y-8 pb-32">
      <div>
        <h1 className="text-4xl font-semibold text-white tracking-tight">Signals studio</h1>
        <p className="text-sm text-zinc-500 mt-2">Full-spectrum dashboards with layered glow treatments.</p>
      </div>
      <div className="grid xl:grid-cols-12 gap-6">
        <GlassPanel hoverGlow className="xl:col-span-7 p-6 h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueSeries} margin={{ top: 14, bottom: -6 }}>
              <defs>
                <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GOLD} stopOpacity={0.45}/>
                  <stop offset="100%" stopColor="#000" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 16" stroke="rgba(255,255,255,0.04)" vertical/>
              <XAxis dataKey="label" stroke="#71717a" tickLine={false}/>
              <YAxis stroke="#71717a" tickFormatter={(v)=>`$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background:'rgba(7,7,11,.95)',border:`1px solid ${GOLD}55`,borderRadius:12}}/>
              <Area type="monotone" dataKey="revenue" stroke="#fef3c7" fill="url(#revFill)" strokeWidth={3}/>
            </AreaChart>
          </ResponsiveContainer>
        </GlassPanel>

        <GlassPanel hoverGlow className="xl:col-span-5 p-6 h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="8 14" stroke="rgba(255,255,255,0.04)" vertical/>
              <Legend/>
              <XAxis dataKey="week" stroke="#71717a" tickLine={false}/>
              <YAxis stroke="#71717a"/>
              <Tooltip contentStyle={{ background:'rgba(7,7,11,.94)',border:'1px solid rgba(251,207,232,.35)',borderRadius:12 }}/>
              <Line type="monotone" dot={{ r: 4 }} dataKey="users" stroke="#f472b6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </GlassPanel>

        <GlassPanel hoverGlow className="xl:col-span-4 p-6 h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deviceStats} layout="vertical" margin={{ left: 52, top: 6, bottom: 6 }}>
              <CartesianGrid horizontal={false} strokeDasharray="4 12" stroke="rgba(255,255,255,0.04)" />
              <XAxis type="number" stroke="#71717a" />
              <YAxis type="category" dataKey="device" stroke="#71717a" width={72} />
              <Tooltip contentStyle={{ background:'rgba(7,7,11,.93)', border:`1px solid ${GOLD}44`, borderRadius:12 }} />
              <Bar dataKey="sessions" radius={[0, 10, 10, 0]} fill={GOLD} />
            </BarChart>
          </ResponsiveContainer>
        </GlassPanel>

        <GlassPanel hoverGlow className="xl:col-span-4 p-6 h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={trafficMix}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="52%"
                outerRadius={102}
                stroke="#09090b"
                strokeWidth={3}
              >
                {trafficMix.map((_, i) => (
                  <Cell key={`t-${i}`} fill={['#fcd34d', '#f472b6', '#818cf8'][i]} />
                ))}
              </Pie>
              <RTooltip />
            </PieChart>
          </ResponsiveContainer>
        </GlassPanel>

        <GlassPanel hoverGlow className="xl:col-span-4 p-6 h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bookingTrends}>
              <Legend/>
              <XAxis dataKey="day" stroke="#71717a" tickLine={false}/>
              <YAxis stroke="#71717a"/>
              <Line type="monotone" strokeWidth={2} stroke={GOLD} dataKey="confirmed" dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </GlassPanel>
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-10 right-6 z-[160] rounded-full px-8 py-4 text-xs uppercase tracking-[0.35em] font-semibold text-black shadow-[0_24px_40px_rgba(212,175,55,.45)] bg-gradient-to-r from-[#fef3c7] via-[#d4af37] to-[#b45309] border border-amber-200/60"
        onClick={() => toast({ title: "Executive briefing exported (fixture)", variant: "success" })}
      >
        ignite brief
      </motion.button>

    </div>
  );
}

