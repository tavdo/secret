import { motion } from "framer-motion";
import { GlassPanel } from "../components/GlassPanel.jsx";
import { chatAlerts as alerts } from "../data/mockAdminData.js";
import { useAdminToast } from "../context/ToastContext.jsx";
import { RadioReceiver, Radar } from "lucide-react";

export function AdminMessaging() {
  const { toast } = useAdminToast();

  const spamIndicators = alerts.map(a => ({
    id: a.id,
    title: `Room · ${a.room}`,
    subtitle: `${a.reason} — ${a.flags.join(", ")}`,
    risk: a.risk,
  }));

  return (
    <div className="space-y-8 pb-28">
      <div className="flex flex-wrap gap-4 items-start justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-white">Messaging intelligence</h1>
          <p className="text-sm text-zinc-500 mt-2">
            Spam heuristics, abuse routing, escalation queue — cinematic monitoring shell.
          </p>
        </div>
        <GlassPanel hoverGlow className="px-4 py-3 flex items-center gap-3 shrink-0">
          <Radar className="h-6 w-6 text-emerald-300 animate-pulse" aria-hidden/>
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Spam models</div>
          <RadioReceiver className="h-6 w-6 text-amber-300" />
        </GlassPanel>
      </div>

      <div className="grid xl:grid-cols-12 gap-6">
        <GlassPanel hoverGlow className="xl:col-span-7 p-6 space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Chat threat matrix</p>
          {spamIndicators.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{opacity:0, x:-14}}
              animate={{opacity:1, x:0}}
              transition={{delay: idx *.08}}
              className="rounded-2xl border border-white/[0.08] bg-black/35 p-5 flex justify-between gap-4 flex-wrap shadow-[inset_0_1px_0_rgba(255,255,255,.06)] hover:border-fuchsia-500/25 hover:shadow-[0_0_24px_rgba(217,70,239,.12)] transition-all cursor-pointer"
              onClick={()=> toast({title:`Escalated ${item.title}`, variant:'warn'})}
            >
              <div><p className="text-sm font-semibold text-white">{item.title}</p><p className="text-xs text-zinc-500 mt-2">{item.subtitle}</p></div>
              <span className="text-[11px] uppercase tracking-[0.3em] text-rose-300">{item.risk} Risk</span>
            </motion.div>
          ))}
        </GlassPanel>

        <GlassPanel hoverGlow className="xl:col-span-5 p-6 space-y-6">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Operator macros</p>
          <motion.button whileTap={{scale:0.96}} type="button" onClick={()=>toast({title:'Shadow banned cluster k-991',variant:'danger'})} className="w-full rounded-2xl border border-rose-500/35 bg-gradient-to-br from-rose-950/60 to-transparent py-4 text-xs uppercase tracking-[0.25em]">Kill multi-account ring</motion.button>
          <motion.button whileTap={{scale:0.96}} type="button" onClick={()=>toast({title:'Pattern trained on benign corpus', variant:'success'})} className="w-full rounded-2xl border border-emerald-500/35 bg-gradient-to-br from-emerald-950/40 py-4 text-xs uppercase tracking-[0.25em]">Retrain conversational models</motion.button>
          <motion.button whileTap={{scale:0.96}} type="button" onClick={()=>toast({title:'Silence-wave broadcast disabled',variant:'warn'})} className="w-full rounded-2xl border border-amber-500/35 py-4 text-xs uppercase tracking-[0.25em]">Pause outbound automations</motion.button>
        </GlassPanel>
      </div>
    </div>
  );
}

