import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RTooltip } from "recharts";
import { Crown, DollarSign, Sparkles } from "lucide-react";
import { GlassPanel } from "../components/GlassPanel.jsx";
import { TablePagination } from "../components/TablePagination.jsx";
import { useAdminToast } from "../context/ToastContext.jsx";
import { useAdminData } from "../context/AdminDataContext.jsx";

const COLORS = ["#D4AF37", "#fcd34d", "#a855f7"];

export function AdminVIP() {
  const ps = 6;
  const [page, setPage] = useState(1);
  const [tierDraft, setTierDraft] = useState(null);

  const {
    vipSubscriptions,
    vipTiers,
    profiles,
    upsertVipTier,
    deleteVipTier,
    toggleVipSubStatus,
    assignSubscriptionPlan,
    toggleProfileVip,
  } = useAdminData();
  const { toast } = useAdminToast();

  const breakdown = vipTiers.map((t, i) => ({
    name: t.name,
    value: vipSubscriptions.filter((v) => v.plan === t.name).length || 1 + i,
  }));

  const totalMrr = useMemo(() => vipSubscriptions.reduce((a, b) => a + b.mrr, 0), [vipSubscriptions]);
  const pageCount = Math.max(1, Math.ceil(vipSubscriptions.length / ps));
  const rows = vipSubscriptions.slice((page - 1) * ps, page * ps);

  const tierCommit = () => {
    if (!tierDraft?.name?.trim()) {
      toast({ title: "Tier name required", variant: "danger" });
      return;
    }
    upsertVipTier(tierDraft);
    setTierDraft(null);
    toast({ title: "Tier lattice saved", variant: "success" });
  };

  return (
    <div className="space-y-6 pb-28">
      <div>
        <h1 className="text-4xl font-semibold text-white tracking-tight">VIP command</h1>
        <p className="text-sm text-zinc-500 mt-2">
          Subscriptions load from the API; tier catalog (names/prices) is local for MRR estimates. Badge toggles sync to profiles.
        </p>
      </div>

      <GlassPanel hoverGlow className="p-6 md:p-8 grid xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Synthetic distribution</p>
          <div className="h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  innerRadius={72}
                  outerRadius={102}
                  paddingAngle={3}
                  dataKey="value"
                  data={breakdown}
                  stroke="#0a0a0a"
                >
                  {breakdown.map((_, i) => (
                    <Cell key={`c-${i}`} strokeWidth={4} stroke="#050505" fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <RTooltip
                  contentStyle={{
                    background: "rgba(9,9,11,.94)",
                    border: "1px solid rgba(212,175,55,.3)",
                    borderRadius: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="xl:col-span-7 space-y-6">
          <div className="flex items-start gap-3">
            <DollarSign className="w-12 h-12 text-emerald-300 shrink-0" />
            <div className="flex-1 space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Blended recurring</p>
              <p className="text-5xl font-semibold text-transparent bg-gradient-to-r from-amber-200 to-rose-400 bg-clip-text">
                ${totalMrr.toLocaleString()}
              </p>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toast({ title: "Rebill choreography queued (stub)", variant: "success" })}
                className="rounded-full border border-amber-500/35 px-6 py-2 text-xs uppercase tracking-[0.25em]"
              >
                Pulse renewals
              </motion.button>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">VIP levels</p>
            <div className="flex flex-wrap gap-2">
              {vipTiers.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTierDraft({ ...t })}
                  className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-[11px] uppercase tracking-[0.15em] text-amber-50"
                >
                  {t.name} · ${t.monthlyPrice}
                </button>
              ))}
              <button
                type="button"
                onClick={() =>
                  setTierDraft({
                    id: "",
                    name: "",
                    monthlyPrice: 249,
                    perks: [],
                    spotlight: false,
                    sortOrder: vipTiers.length,
                  })
                }
                className="rounded-xl border border-dashed border-white/20 px-3 py-2 text-[11px]"
              >
                + tier
              </button>
            </div>
          </div>
        </div>
      </GlassPanel>

      {tierDraft && (
        <GlassPanel hoverGlow className="p-6 space-y-4">
          <p className="text-sm font-semibold text-white">Architect tier · {tierDraft.name || "new"}</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block space-y-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              Title
              <input
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none"
                value={tierDraft.name}
                onChange={(e) => setTierDraft({ ...tierDraft, name: e.target.value })}
              />
            </label>
            <label className="block space-y-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              MRR USD
              <input
                type="number"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none"
                value={tierDraft.monthlyPrice}
                onChange={(e) => setTierDraft({ ...tierDraft, monthlyPrice: Number(e.target.value) })}
              />
            </label>
            <label className="flex gap-3 items-center text-sm text-zinc-300 mt-6">
              <input
                type="checkbox"
                checked={tierDraft.spotlight}
                onChange={(e) => setTierDraft({ ...tierDraft, spotlight: e.target.checked })}
              />
              Spotlight carousel
            </label>
          </div>
          <label className="block space-y-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Perks (comma separated)
            <input
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none"
              value={(tierDraft.perks || []).join(", ")}
              onChange={(e) =>
                setTierDraft({
                  ...tierDraft,
                  perks: e.target.value
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean),
                })
              }
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={tierCommit}
              className="rounded-xl border border-amber-400/35 bg-gradient-to-br from-amber-300 to-amber-700 px-6 py-2 text-xs uppercase tracking-[0.2em] text-black"
            >
              Commit tier
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => {
                if (tierDraft?.id) {
                  deleteVipTier(tierDraft.id);
                  setTierDraft(null);
                }
              }}
              className="rounded-xl border border-rose-500/35 px-4 py-2 text-xs uppercase tracking-[0.2em] text-rose-200"
            >
              Retire tier
            </motion.button>
            <button type="button" className="text-xs text-zinc-500 underline" onClick={() => setTierDraft(null)}>
              Close
            </button>
          </div>
        </GlassPanel>
      )}

      <GlassPanel hoverGlow className="p-6 space-y-4">
        <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Premium showcase toggles</p>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {profiles.slice(0, 6).map((p) => (
            <label
              key={p.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-xs"
            >
              <span className="truncate text-white">{p.displayName}</span>
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-amber-200">
                <Crown className="h-3.5 w-3.5" />
                <input
                  type="checkbox"
                  checked={p.vip}
                  onChange={(e) => toggleProfileVip(p.id, e.target.checked)}
                />
              </span>
            </label>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel hoverGlow className="p-6">
        <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
          <table className="min-w-[760px] w-full border-collapse text-sm">
            <thead className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 text-left">
              <tr>
                <th className="p-3">Tier</th>
                <th className="p-3">Member</th>
                <th className="p-3">MRR</th>
                <th className="p-3">Renews</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {rows.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="p-3 text-amber-200">{u.plan}</td>
                  <td className="p-3 text-white">{u.memberHandle}</td>
                  <td className="p-3">${u.mrr}</td>
                  <td className="p-3 text-zinc-500">{u.renewsIn}</td>
                  <td className="p-3 capitalize">{u.status}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <select
                        className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-[11px]"
                        value={vipTiers.some((x) => x.name === u.plan) ? u.plan : vipTiers[0]?.name}
                        onChange={async (e) => {
                          try {
                            await assignSubscriptionPlan(u.id, e.target.value);
                            toast({ title: `Plan → ${e.target.value}`, variant: "success" });
                          } catch (err) {
                            toast({
                              title: err?.response?.data?.error || err?.message || "Plan update failed",
                              variant: "danger",
                            });
                          }
                        }}
                      >
                        {vipTiers.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        onClick={async () => {
                          try {
                            await toggleVipSubStatus(
                              u.id,
                              u.status === "active" ? "paused" : "active"
                            );
                            toast({
                              title: u.status === "active" ? "Paused" : "Resumed",
                              variant: "success",
                            });
                          } catch (err) {
                            toast({
                              title: err?.response?.data?.error || err?.message || "Update failed",
                              variant: "danger",
                            });
                          }
                        }}
                        className="rounded-lg border border-amber-500/35 px-2 py-1 text-[11px] uppercase tracking-[0.15em]"
                      >
                        {u.status === "active" ? "Pause" : "Resume"}
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination page={page} pageCount={pageCount} totalItems={vipSubscriptions.length} onPageChange={setPage} />
      </GlassPanel>

      <p className="text-[11px] text-center text-zinc-600 uppercase tracking-[0.25em] flex items-center justify-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-amber-400" /> VIP subscriptions sync via /admin/vip-subscriptions
      </p>
    </div>
  );
}
