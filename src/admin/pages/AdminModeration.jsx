import { useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, EyeOff } from "lucide-react";
import { GlassPanel } from "../components/GlassPanel.jsx";
import { moderationQueue } from "../data/mockAdminData.js";
import { useAdminToast } from "../context/ToastContext.jsx";
import { Modal } from "../components/Modal.jsx";

export function AdminModeration() {
  const [blurSens, setBlurSens] = useState(true);
  const [focusItem, setFocusItem] = useState(null);
  const { toast } = useAdminToast();

  return (
    <div className="space-y-6 pb-28">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Profile moderation</h1>
          <p className="text-sm text-zinc-500 mt-2">
            Sensitive preview blur, verification badges, escalation hooks.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setBlurSens((b) => !b)}
          className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.25em]"
        >
          <EyeOff className="inline h-4 w-4 mr-2" aria-hidden /> {blurSens ? "Sensory blur ON" : "RAW preview"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {moderationQueue.map((m, idx) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
            <GlassPanel hoverGlow className="p-5 h-full flex flex-col">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{m.city}</p>
                  <h3 className="text-xl font-semibold text-white mt-1">{m.name}</h3>
                  <p className="text-xs text-zinc-500 mt-1">Submitted {m.submitted}</p>
                  <div className="mt-4 flex gap-4">
                    {[0,1].map((i) => (
                      <div key={i} className={`h-36 flex-1 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-800 to-black ${blurSens ? 'blur-xl' : ''} relative overflow-hidden`}>
                        <div className="absolute inset-x-4 top-4 h-2 rounded-full bg-white/10"/>
                        <div className="absolute inset-x-4 top-12 h-2 rounded-full bg-white/10 w-4/6"/>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-amber-200 font-semibold">Risk {m.riskScore.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-3 mt-auto pt-5">
                <button type="button" onClick={() => toast({ title: `Approved · ${m.name}`, variant: "success" })} className="flex-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-3 py-2 text-xs uppercase tracking-[0.2em]">Approve</button>
                <button type="button" onClick={() => toast({ title: `Rejected · ${m.name}`, variant: "danger" })} className="flex-1 rounded-xl border border-white/15 px-3 py-2 text-xs uppercase tracking-[0.2em]">Reject</button>
                <button type="button" onClick={()=>setFocusItem(m)} className="rounded-xl border border-white/15 px-3 py-2 text-xs uppercase tracking-[0.2em]">Deep</button>
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      <GlassPanel hoverGlow className="p-6 mt-10">
        <div className="flex items-start gap-3">
          <BadgeCheck className="h-10 w-10 text-amber-300" />
          <div className="text-sm text-zinc-400">
            Badge automation policy: luminous verification requires human-in-the-loop. Wire PATCH /admin/profiles endpoints from existing API.
          </div>
        </div>
      </GlassPanel>

      <Modal title={focusItem?.name ?? ""} open={Boolean(focusItem)} onClose={()=>setFocusItem(null)} subtitle="Extended dossier queue">
        {focusItem && (
          <div className="text-sm space-y-2 text-zinc-300">
            <p>Signals: portfolio drift detection, biometric hash pending, escrow wallet linked.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
