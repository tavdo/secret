import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Flame, ShieldBan, Zap } from "lucide-react";
import { GlassPanel } from "../components/GlassPanel.jsx";
import { TablePagination } from "../components/TablePagination.jsx";
import { useAdminToast } from "../context/ToastContext.jsx";
import { Modal } from "../components/Modal.jsx";
import { cn } from "../lib/cn.js";

const reportsSafety = [];

export function AdminReports() {
  const ps = 9;
  const [page,setPage]=useState(1);
  const [status,setStatus]=useState('ALL');
  const [panic,setPanic]=useState(false);
  const {toast}=useAdminToast();
  const filt=useMemo(()=>reportsSafety.filter(r=>status==='ALL'||r.status===status),[status]);
  const pc=Math.max(1,Math.ceil(filt.length/ps));
  const rows=filt.slice((page-1)*ps,page*ps);

  return (
    <div className="space-y-8 pb-28">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div><h1 className="text-4xl font-semibold text-white tracking-tight">Safety & escalation</h1><p className="text-sm text-zinc-500 mt-2">Incident desk with panic rails and synthetic anomaly scoring.</p></div>
        <motion.button whileTap={{scale:0.94}} type="button" onClick={()=>{setPanic(true); toast({title:'SYSTEM freeze engaged (training module)',variant:'danger'});}} className="rounded-full border border-rose-500/55 bg-gradient-to-r from-rose-700/55 to-transparent px-6 py-3 text-xs uppercase tracking-[0.35em] text-rose-50 shadow-[0_0_32px_rgba(244,63,94,.4)]"><Flame className="inline h-5 w-5 mr-2 align-text-bottom"/> emergency pause</motion.button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { Icon: Flame, lab: 'Suspected impersonation spike', pct: '+12%' },
          { Icon: ShieldBan, lab: 'Synthetic media ratio', pct: '+3%' },
          { Icon: Zap, lab: 'Stripe fraud pings', pct: '+0.9%' },
        ].map(({ Icon: CardIcon, lab, pct }) => (
          <GlassPanel key={lab} hoverGlow className="p-5 flex items-center gap-3">
            <CardIcon className="h-10 w-10 text-amber-300" />
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Signal</p>
              <p className="text-sm text-white font-medium">{lab}</p>
              <p className="text-emerald-300 text-[11px] mt-2">{pct} vs cohort</p>
            </div>
          </GlassPanel>
        ))}
      </div>

      <GlassPanel hoverGlow className="p-6">
        <select value={status} onChange={(e)=>{setStatus(e.target.value); setPage(1);}} className="mb-6 rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs uppercase tracking-[0.2em] text-zinc-200">
          {["ALL","OPEN","IN_REVIEW","RESOLVED","DISMISSED"].map((s)=> <option key={s} value={s} className="bg-zinc-900">{s}</option>)}
        </select>
        <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
          <table className="min-w-[860px] w-full border-collapse text-sm">
            <thead className="text-[10px] uppercase tracking-[0.28em] text-zinc-500 text-left"><tr><th className="p-3">ID</th><th className="p-3">Category</th><th className="p-3">Subject</th><th className="p-3">Reporter</th><th className="p-3">Priority</th><th className="p-3">Created</th><th /></tr></thead>
            <tbody className="divide-y divide-white/[0.04]">
              {rows.map((r)=> (
                <tr key={r.id}><td className="p-3 text-amber-200">{r.id}</td><td className="p-3 text-white">{r.category}</td><td>{r.subject}</td><td className="p-3 text-zinc-400">{r.reporter}</td><td className="p-3"><span className={cn(r.priority==="URGENT"&&"text-rose-400", r.priority==="HIGH"&&"text-orange-400","text-[11px]")}>{r.priority}</span></td><td className="p-3 text-zinc-500 text-xs">{r.created}</td><td className="p-3 text-right"><button type="button" className="text-[11px] uppercase tracking-[0.2em]" onClick={()=>toast({title:`${r.id} resolved`,variant:'success'})}>resolve</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination page={page} pageCount={pc} totalItems={filt.length} onPageChange={(p)=>setPage(p)} />
      </GlassPanel>

      <Modal open={panic} onClose={()=>setPanic(false)} title="Emergency freeze playbook" subtitle="Training simulation only">
        <p className="text-sm text-zinc-400">Freeze outbound automations · alert legal · rotate signing keys · broadcast trust banner.</p>
      </Modal>
    </div>
  );
}
