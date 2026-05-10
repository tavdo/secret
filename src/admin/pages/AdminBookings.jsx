import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Check, Trash2, XCircle } from "lucide-react";
import { GlassPanel } from "../components/GlassPanel.jsx";
import { TablePagination } from "../components/TablePagination.jsx";
import { useAdminToast } from "../context/ToastContext.jsx";
import { cn } from "../lib/cn.js";
import { useAdminData } from "../context/AdminDataContext.jsx";

export function AdminBookings() {
  const ps = 7;
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("ALL");
  const { toast } = useAdminToast();
  const { bookings, setBookingStatus } = useAdminData();

  const filt = useMemo(
    () => bookings.filter((b) => status === "ALL" || b.status === status),
    [bookings, status]
  );

  const agg = filt.reduce((acc, b) => ({ ...acc, [b.city]: (acc[b.city] || 0) + 1 }), {});
  const chartData = Object.keys(agg).map((k) => ({ city: k, bookings: agg[k] }));

  const pc = Math.max(1, Math.ceil(filt.length / ps));
  const rows = filt.slice((page - 1) * ps, page * ps);

  const act = (b, action) => {
    if (action === "approve") {
      setBookingStatus(b.id, "ACCEPTED");
      toast({ title: `${b.id} accepted`, variant: "success" });
    } else if (action === "reject") {
      setBookingStatus(b.id, "REJECTED");
      toast({ title: `${b.id} rejected`, variant: "warn" });
    } else if (action === "complete") {
      setBookingStatus(b.id, "COMPLETED");
      toast({ title: `${b.id} settled`, variant: "success" });
    }
  };

  return (
    <div className="space-y-8 pb-28">
      <div className="flex flex-wrap gap-4 items-end justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-white">Booking operations</h1>
          <p className="text-sm text-zinc-500 mt-2">
            Sovereign adjudication rails — Axios ready on <code className="text-amber-200/90">PATCH /bookings/:id</code>.
          </p>
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs uppercase tracking-[0.2em] text-zinc-200"
        >
          {["ALL", "PENDING", "ACCEPTED", "REJECTED", "COMPLETED"].map((s) => (
            <option key={s} value={s} className="bg-zinc-900">
              {s}
            </option>
          ))}
        </select>
      </div>

      <GlassPanel hoverGlow className="p-6">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">City density</p>
        <div className="mt-6 h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="6 14" stroke="rgba(255,255,255,0.04)" vertical />
              <XAxis dataKey="city" stroke="#71717a" tickLine={false} />
              <YAxis stroke="#71717a" tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(9,9,11,.95)",
                  borderRadius: 12,
                  border: "1px solid rgba(212,175,55,.35)",
                }}
              />
              <Bar dataKey="bookings" fill="#fde68a" radius={[14, 14, 9, 9]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassPanel>

      <GlassPanel hoverGlow className="p-6">
        <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
          <table className="min-w-[880px] w-full border-collapse text-sm">
            <thead className="text-[10px] uppercase tracking-[0.28em] text-zinc-500 text-left">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Client</th>
                <th className="p-3">Provider</th>
                <th className="p-3">Metro</th>
                <th className="p-3">Status</th>
                <th className="p-3">Spend</th>
                <th className="p-3">Window</th>
                <th className="p-3 text-right">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {rows.map((b, i) => (
                <motion.tr
                  key={b.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover:bg-white/[0.02]"
                >
                  <td className="p-3 text-amber-200">{b.id}</td>
                  <td className="p-3 text-white">{b.client}</td>
                  <td className="p-3 text-zinc-300">{b.provider}</td>
                  <td className="p-3">{b.city}</td>
                  <td className="p-3">
                    <span
                      className={cn(
                        "text-[11px] uppercase tracking-[0.2em]",
                        b.status === "PENDING" && "text-amber-300",
                        b.status === "ACCEPTED" && "text-emerald-300",
                        b.status === "REJECTED" && "text-rose-300",
                        b.status === "COMPLETED" && "text-violet-200"
                      )}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3">${b.value}</td>
                  <td className="p-3 text-zinc-500 text-xs">{b.starts}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2 justify-end">
                      {b.status === "PENDING" && (
                        <>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.04 }}
                            onClick={() => act(b, "approve")}
                            className="rounded-lg border border-emerald-500/35 px-2 py-1 text-[11px] text-emerald-200 inline-flex items-center gap-1"
                          >
                            <Check className="h-3.5 w-3.5" /> accept
                          </motion.button>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.04 }}
                            onClick={() => act(b, "reject")}
                            className="rounded-lg border border-rose-500/35 px-2 py-1 text-[11px] text-rose-200 inline-flex items-center gap-1"
                          >
                            <XCircle className="h-3.5 w-3.5" /> reject
                          </motion.button>
                        </>
                      )}
                      {b.status === "ACCEPTED" && (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.04 }}
                          onClick={() => act(b, "complete")}
                          className="rounded-lg border border-violet-500/35 px-2 py-1 text-[11px] text-violet-100"
                        >
                          mark done
                        </motion.button>
                      )}
                      {(b.status === "REJECTED" || b.status === "COMPLETED") && (
                        <button type="button" className="text-[11px] text-zinc-600 inline-flex gap-1">
                          <Trash2 className="h-3.5 w-3.5" /> ledger locked
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination page={page} pageCount={pc} totalItems={filt.length} onPageChange={(p) => setPage(p)} />
      </GlassPanel>
    </div>
  );
}
