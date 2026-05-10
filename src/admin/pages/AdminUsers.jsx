import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download, Eye, Filter, PauseCircle, RotateCcw, Ban } from "lucide-react";
import { GlassPanel } from "../components/GlassPanel.jsx";
import { Modal } from "../components/Modal.jsx";
import { TablePagination } from "../components/TablePagination.jsx";
import { useAdminData } from "../context/AdminDataContext.jsx";
import { useAdminToast } from "../context/ToastContext.jsx";
import { cn } from "../lib/cn.js";

export function AdminUsers() {
  const { toast } = useAdminToast();
  const { users: demoUsers, banUser, suspendUser, resetUserStatus } = useAdminData();
  const pageSize = 8;
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [selected, setSelected] = useState(() => new Set());
  const [preview, setPreview] = useState(null);

  const filtered = useMemo(() => {
    return demoUsers.filter((u) => {
      const matchQ =
        !q ||
        u.handle.toLowerCase().includes(q.toLowerCase()) ||
        u.email.toLowerCase().includes(q.toLowerCase());
      const matchRole = role === "ALL" || u.role === role;
      const matchStatus = status === "ALL" || u.status === status;
      return matchQ && matchRole && matchStatus;
    });
  }, [q, role, status, demoUsers]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const display = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSel = (id, active) => {
    setSelected((prev) => {
      const ns = new Set(prev);
      if (active) ns.add(id); else ns.delete(id);
      return ns;
    });
  };

  return (
    <div className="space-y-6 pb-28">
      <div>
        <h1 className="text-4xl font-semibold text-white tracking-tight">User management</h1>
        <p className="text-sm text-zinc-500 mt-2 max-w-2xl leading-relaxed">
          Glass table with premium density, animated rows, moderation rails, export hooks, and inline VIP choreography.
        </p>
      </div>

      <GlassPanel hoverGlow className="p-4 md:p-6">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <input
                placeholder="Search handle / email"
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
                className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white w-52 md:w-64 focus:border-amber-400/50 outline-none"
              />
            </div>
            <select
              value={role}
              onChange={(e) => { setRole(e.target.value); setPage(1); }}
              className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs uppercase tracking-[0.2em] text-zinc-200"
            >
              {["ALL", "USER", "PROVIDER", "ADMIN"].map((r) => (
                <option key={r} value={r} className="bg-zinc-900">
                  {r}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs uppercase tracking-[0.2em] text-zinc-200"
            >
              {["ALL", "ACTIVE", "SUSPENDED", "BANNED"].map((s) => (
                <option key={s} value={s} className="bg-zinc-900">
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                toast({ title: `${selected.size} queued for bulk moderation (demo)`, variant: "warn" })
              }
              className="inline-flex items-center gap-2 rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-2 text-xs uppercase tracking-[0.18em]"
            >
              <Filter className="h-4 w-4" /> Bulk mute
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => toast({ title: "CSV queued to secure bucket", variant: "success" })}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/35 px-4 py-2 text-xs uppercase tracking-[0.18em]"
            >
              <Download className="h-4 w-4 text-emerald-300" /> Export
            </motion.button>
          </div>
        </div>

        <div className="overflow-x-auto mt-6 rounded-2xl border border-white/[0.06]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                <th className="p-4 w-10">
                  <input
                    aria-label="select all visible"
                    type="checkbox"
                    onChange={(e) => {
                      setSelected(() => new Set(display.map((d) => d.id)));
                      if (!e.target.checked) setSelected(() => new Set());
                    }}
                  />
                </th>
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold hidden md:table-cell">Role</th>
                <th className="p-4 font-semibold hidden lg:table-cell">Status</th>
                <th className="p-4 font-semibold hidden lg:table-cell">VIP</th>
                <th className="p-4 font-semibold hidden xl:table-cell">Spend</th>
                <th className="p-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/[0.04]">
              {display.map((u, idx) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-white/[0.01] hover:bg-white/[0.04]"
                >
                  <td className="p-4 align-middle">
                    <input
                      type="checkbox"
                      checked={selected.has(u.id)}
                      onChange={(e) => toggleSel(u.id, e.target.checked)}
                    />
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-white">{u.handle}</p>
                    <p className="text-xs text-zinc-500 truncate max-w-[12rem] md:max-w-xs">{u.email}</p>
                    <p className="text-[11px] text-zinc-600 mt-1">{u.lastActive}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-zinc-300">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-[11px]",
                        u.status === "ACTIVE" && "bg-emerald-500/15 text-emerald-200 border border-emerald-500/30",
                        u.status === "SUSPENDED" &&
                          "bg-amber-500/15 text-amber-50 border border-amber-400/35",
                        u.status === "BANNED" && "bg-rose-600/25 text-rose-100 border border-rose-500/40"
                      )}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 hidden lg:table-cell text-amber-200 text-xs">{u.vipBadge ? "VIP" : "–"}</td>
                  <td className="p-4 hidden xl:table-cell text-zinc-200">${u.spend.toLocaleString()}</td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setPreview(u)}
                      className="inline-flex mr-2 rounded-xl border border-white/10 px-2 py-1 text-[11px] uppercase tracking-[0.2em]"
                    >
                      <Eye className="h-4 w-4 mr-1" /> view
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      onClick={() => {
                        suspendUser(u.id);
                        toast({ title: `Suspended ${u.handle}`, variant: "warn" });
                      }}
                      className="inline-flex mr-2 rounded-xl border border-amber-500/30 px-2 py-1 text-[11px]"
                    >
                      <PauseCircle className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      onClick={() => {
                        banUser(u.id);
                        toast({ title: `Banned ${u.handle}`, variant: "danger" });
                      }}
                      className="inline-flex mr-2 rounded-xl border border-rose-500/35 px-2 py-1 text-[11px]"
                    >
                      <Ban className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      onClick={() => {
                        resetUserStatus(u.id);
                        toast({ title: `Reset ${u.handle}`, variant: "success" });
                      }}
                      className="inline-flex rounded-xl border border-emerald-500/35 px-2 py-1 text-[11px]"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination page={page} pageCount={pageCount} totalItems={filtered.length} onPageChange={(p)=>setPage(p)} />
      </GlassPanel>

      <Modal open={Boolean(preview)} onClose={()=>setPreview(null)} title={preview?.handle ?? ""} subtitle="Profile intelligence">
        {preview ? (
          <div className="space-y-3 text-sm text-zinc-300">
            <p>Encrypted email path: <span className="text-white">{preview.email}</span></p>
            <p>VIP luminous badge:{" "}<span className="text-amber-200">{preview.vipBadge ? "Active" : "Standard"}</span></p>
            <p>Risk sentinel: deterministic demo score <span className="text-emerald-300">{0.82 - preview.bookings / 130}</span></p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
