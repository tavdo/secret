import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Percent, Sparkles } from 'lucide-react';
import { GlassPanel } from '../components/GlassPanel.jsx';
import { useAdminData } from '../context/AdminDataContext.jsx';
import { useAdminToast } from '../context/ToastContext.jsx';

export function AdminPricing() {
  const { pricingPackages, upsertPricingPackage, deletePricingPackage } = useAdminData();
  const { toast } = useAdminToast();
  const [draft, setDraft] = useState(null);

  const startEdit = (row) => setDraft({ ...row });
  const resetDraft = () => setDraft(null);

  const commit = () => {
    if (!draft?.name?.trim()) {
      toast({ title: 'Label required', variant: 'danger' });
      return;
    }
    upsertPricingPackage(draft);
    toast({ title: 'Yield saved', variant: 'success' });
    resetDraft();
  };

  return (
    <div className="space-y-8 pb-28">
      <div>
        <p className="text-[11px] uppercase tracking-[0.38em] text-amber-500/80 font-semibold">Commercial OS</p>
        <h1 className="mt-1 text-4xl font-semibold text-white tracking-tight">Pricing control</h1>
        <p className="text-sm text-zinc-500 mt-2 max-w-3xl leading-relaxed">
          Dynamic itineraries, luminous VIP deltas, ephemeral offers — all portable to Axios price webhooks later.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        {pricingPackages.map((pkg, idx) => (
          <motion.div key={pkg.id} className="lg:col-span-6 xl:col-span-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
            <GlassPanel hoverGlow className="p-6 h-full flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <Layers className="h-10 w-10 text-amber-200 shrink-0" />
                <div className="text-right space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-500">{pkg.active ? 'active' : 'sunset'}</p>
                  <p className="text-3xl font-semibold text-white">${pkg.basePrice}</p>
                  <p className="text-[11px] text-zinc-500">{pkg.hours}h arc</p>
                </div>
              </div>
              <p className="mt-4 text-lg font-medium text-white">{pkg.name}</p>
              <p className="text-sm text-zinc-400 mt-2 flex-1 leading-relaxed">{pkg.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.15em]">
                <span className="rounded-full border border-amber-500/35 bg-amber-500/10 px-3 py-1 text-amber-100">
                  VIP −{pkg.vipDiscountPct ?? 0}%
                </span>
                {pkg.specialOfferPct != null && (
                  <span className="rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3 py-1 text-emerald-100 inline-flex gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> flash −{pkg.specialOfferPct}%
                  </span>
                )}
              </div>
              <div className="mt-6 flex gap-3">
                <motion.button whileTap={{ scale: 0.98 }} type="button" onClick={() => startEdit(pkg)} className="flex-1 rounded-xl border border-white/12 py-2 text-xs uppercase tracking-[0.18em]">
                  Architect
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => {
                    deletePricingPackage(pkg.id);
                    toast({ title: `${pkg.name} retired`, variant: 'warn' });
                  }}
                  className="rounded-xl border border-rose-500/30 px-3 py-2 text-xs uppercase tracking-[0.18em] text-rose-200"
                >
                  Sunset
                </motion.button>
              </div>
            </GlassPanel>
          </motion.div>
        ))}

        <motion.div className="lg:col-span-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <GlassPanel className="p-6 border-dashed border-white/14">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">Spin new SKU</p>
                <p className="text-xs text-zinc-500 mt-1">Packages compile into checkout rails + VIP escalators.</p>
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  setDraft({
                    id: '',
                    name: '',
                    description: '',
                    hours: 2,
                    basePrice: 900,
                    vipDiscountPct: 10,
                    specialOfferPct: null,
                    active: true,
                  })
                }
                className="rounded-2xl border border-amber-400/35 px-6 py-2 text-xs uppercase tracking-[0.22em]"
              >
                + Package
              </motion.button>
            </div>
          </GlassPanel>
        </motion.div>
      </div>

      <GlassPanel hoverGlow className="p-8">
        <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">Architect console</p>
        {draft ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <FloatingInput label="Name" value={draft.name} onChange={(v) => setDraft((d) => ({ ...d, name: v }))} />
            <FloatingInput label="Hours" number value={draft.hours} onChange={(v) => setDraft((d) => ({ ...d, hours: Number(v) }))} />
            <FloatingInput label="Base price USD" number value={draft.basePrice} onChange={(v) => setDraft((d) => ({ ...d, basePrice: Number(v) }))} />
            <FloatingInput
              label="VIP discount %"
              number
              value={draft.vipDiscountPct}
              onChange={(v) => setDraft((d) => ({ ...d, vipDiscountPct: Number(v) }))}
            />
            <FloatingInput
              label="Special offer % (optional)"
              number
              value={draft.specialOfferPct ?? ''}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  specialOfferPct: v === '' ? null : Number(v),
                }))
              }
            />
            <label className="flex items-center gap-3 mt-8">
              <input type="checkbox" checked={draft.active} onChange={(e) => setDraft((d) => ({ ...d, active: e.target.checked }))} />
              <span className="text-sm text-zinc-300">Selling now</span>
            </label>
            <label className="md:col-span-2 xl:col-span-3 block space-y-2">
              <span className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">Description • CMS line</span>
              <textarea
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-amber-400/40"
              />
            </label>
            <div className="flex flex-wrap gap-3 pt-6 md:col-span-3">
              <motion.button whileTap={{ scale: 0.97 }} type="button" onClick={commit} className="rounded-xl border border-amber-400/35 bg-gradient-to-br from-amber-300/90 to-amber-800/90 px-8 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-black">
                Commit pricing
              </motion.button>
              <button type="button" onClick={resetDraft} className="rounded-xl border border-white/12 px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-zinc-400">
                Abort
              </button>
              <Percent className="hidden md:block h-14 w-14 text-emerald-200/70 ml-auto" />
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-600 mt-6 md:mt-8">Tap architect on any card — or summon a pristine SKU ribbon above.</p>
        )}
      </GlassPanel>
    </div>
  );
}

function FloatingInput({ label, value, onChange, number: isNum }) {
  return (
    <label className="block space-y-1">
      <span className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">{label}</span>
      <input
        type={isNum ? 'number' : 'text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-sm outline-none focus:border-amber-400/40"
      />
    </label>
  );
}
