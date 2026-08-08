import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, ShieldAlert, FileWarning } from 'lucide-react';
import { GlassPanel } from '../components/GlassPanel.jsx';
import { TablePagination } from '../components/TablePagination.jsx';
import { useAdminToast } from '../context/ToastContext.jsx';
import { Modal } from '../components/Modal.jsx';
import { cn } from '../lib/cn.js';
import { useAdminData } from '../context/AdminDataContext.jsx';

export function AdminReports() {
  const ps = 9;
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('ALL');
  const [panic, setPanic] = useState(false);
  const { toast } = useAdminToast();
  const { reports, resolveReport, analytics, refreshReports } = useAdminData();

  const filt = useMemo(
    () => reports.filter((r) => status === 'ALL' || r.status === status),
    [reports, status]
  );
  const pc = Math.max(1, Math.ceil(filt.length / ps));
  const rows = filt.slice((page - 1) * ps, page * ps);

  const openCount = reports.filter((r) => r.status === 'OPEN').length;
  const reviewCount = reports.filter((r) => r.status === 'IN_REVIEW').length;

  const act = async (r, next) => {
    try {
      await resolveReport(r.id, next);
      toast({ title: `${r.id.slice(0, 8)}… → ${next}`, variant: 'success' });
    } catch (err) {
      toast({
        title: err?.response?.data?.error || err?.message || 'Update failed',
        variant: 'danger',
      });
    }
  };

  return (
    <div className="space-y-8 pb-28">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-4xl font-semibold text-white tracking-tight">Safety & escalation</h1>
          <p className="text-sm text-zinc-500 mt-2">
            Live reports from `/admin/reports` — open queue: {analytics?.unreadReports ?? openCount}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => void refreshReports()}
            className="rounded-full border border-white/15 px-5 py-3 text-xs uppercase tracking-[0.25em]"
          >
            Refresh
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            type="button"
            onClick={() => {
              setPanic(true);
              toast({ title: 'Emergency playbook opened', variant: 'danger' });
            }}
            className="rounded-full border border-rose-500/55 bg-gradient-to-r from-rose-700/55 to-transparent px-6 py-3 text-xs uppercase tracking-[0.35em] text-rose-50"
          >
            <Flame className="inline h-5 w-5 mr-2 align-text-bottom" /> emergency
          </motion.button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { Icon: FileWarning, lab: 'Open reports', pct: String(openCount) },
          { Icon: ShieldAlert, lab: 'In review', pct: String(reviewCount) },
          { Icon: Flame, lab: 'Total loaded', pct: String(reports.length) },
        ].map(({ Icon: CardIcon, lab, pct }) => (
          <GlassPanel key={lab} hoverGlow className="p-5 flex items-center gap-3">
            <CardIcon className="h-10 w-10 text-amber-300" />
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Signal</p>
              <p className="text-sm text-white font-medium">{lab}</p>
              <p className="text-emerald-300 text-[11px] mt-2">{pct}</p>
            </div>
          </GlassPanel>
        ))}
      </div>

      <GlassPanel hoverGlow className="p-6">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="mb-6 rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs uppercase tracking-[0.2em] text-zinc-200"
        >
          {['ALL', 'OPEN', 'IN_REVIEW', 'RESOLVED', 'DISMISSED'].map((s) => (
            <option key={s} value={s} className="bg-zinc-900">
              {s}
            </option>
          ))}
        </select>
        <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
          <table className="min-w-[860px] w-full border-collapse text-sm">
            <thead className="text-[10px] uppercase tracking-[0.28em] text-zinc-500 text-left">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Category</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Reporter</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    No reports in this filter.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id}>
                    <td className="p-3 text-amber-200 font-mono text-xs">{r.id.slice(0, 10)}…</td>
                    <td className="p-3 text-white">{r.category}</td>
                    <td className="p-3">{r.subject}</td>
                    <td className="p-3 text-zinc-400">{r.reporter}</td>
                    <td className="p-3">
                      <span
                        className={cn(
                          'text-[11px] uppercase tracking-[0.15em]',
                          r.status === 'OPEN' && 'text-rose-300',
                          r.status === 'IN_REVIEW' && 'text-amber-300',
                          r.status === 'RESOLVED' && 'text-emerald-300',
                          r.status === 'DISMISSED' && 'text-zinc-500'
                        )}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-500 text-xs">{r.created}</td>
                    <td className="p-3 text-right whitespace-nowrap space-x-2">
                      {r.status === 'OPEN' && (
                        <button
                          type="button"
                          className="text-[11px] uppercase tracking-[0.2em] text-amber-200"
                          onClick={() => void act(r, 'IN_REVIEW')}
                        >
                          review
                        </button>
                      )}
                      {r.status !== 'RESOLVED' && r.status !== 'DISMISSED' && (
                        <>
                          <button
                            type="button"
                            className="text-[11px] uppercase tracking-[0.2em] text-emerald-300"
                            onClick={() => void act(r, 'RESOLVED')}
                          >
                            resolve
                          </button>
                          <button
                            type="button"
                            className="text-[11px] uppercase tracking-[0.2em] text-zinc-400"
                            onClick={() => void act(r, 'DISMISSED')}
                          >
                            dismiss
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <TablePagination
          page={page}
          pageCount={pc}
          totalItems={filt.length}
          onPageChange={(p) => setPage(p)}
        />
      </GlassPanel>

      <Modal open={panic} onClose={() => setPanic(false)} title="Emergency freeze playbook" subtitle="Ops checklist">
        <p className="text-sm text-zinc-400">
          Pause new registrations · review open reports · rotate admin sessions · notify trust channel.
        </p>
      </Modal>
    </div>
  );
}
