import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { GlassPanel } from '../components/GlassPanel.jsx';
import { ProfileTable } from '../components/ProfileTable.jsx';
import { ProfileFormModal } from '../components/ProfileFormModal.jsx';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal.jsx';
import { SkeletonPulse } from '../components/Skeleton.jsx';
import { useAdminData } from '../context/AdminDataContext.jsx';
import { useAdminToast } from '../context/ToastContext.jsx';

export function AdminProfiles() {
  const { profiles, deleteProfile } = useAdminData();
  const { toast } = useAdminToast();
  const [loading] = useState(false);
  const [q, setQ] = useState('');
  const [city, setCity] = useState('ALL');
  const [vipOnly, setVipOnly] = useState(false);
  const [availability, setAvailability] = useState('ALL'); // ALL | ONLINE | OFFLINE

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [purge, setPurge] = useState(null);

  const cities = useMemo(() => {
    const s = new Set(profiles.map((p) => p.city).filter(Boolean));
    return Array.from(s).sort();
  }, [profiles]);

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      const hit =
        !q ||
        p.displayName.toLowerCase().includes(q.toLowerCase()) ||
        (p.handle && p.handle.toLowerCase().includes(q.toLowerCase())) ||
        p.city.toLowerCase().includes(q.toLowerCase());
      const met = city === 'ALL' || p.city === city;
      const vip = !vipOnly || p.vip;
      const avail =
        availability === 'ALL' ||
        (availability === 'ONLINE' && p.available) ||
        (availability === 'OFFLINE' && !p.available);
      return hit && met && vip && avail;
    });
  }, [profiles, q, city, vipOnly, availability]);

  return (
    <div className="space-y-8 pb-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.36em] text-amber-500/80 font-semibold">
            Control nucleus
          </p>
          <h1 className="mt-1 text-4xl font-semibold tracking-tight text-white">Profile matrix</h1>
          <p className="text-sm text-zinc-500 mt-2 max-w-2xl leading-relaxed">
            CRUD‑ready storefront talent — sovereign editing, luminous flags, carousel choreography.
          </p>
        </div>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditing(null);
            setEditorOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-2xl border border-amber-400/35 bg-gradient-to-r from-amber-500/30 to-transparent px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.22em]"
        >
          <Plus className="h-4 w-4" /> Mint profile
        </motion.button>
      </div>

      <GlassPanel hoverGlow className="p-4 md:p-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, handle, city…"
              className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-amber-400/40"
            />
          </div>
          <div className="flex items-center gap-2 text-zinc-600">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs uppercase tracking-[0.15em]"
          >
            <option value="ALL">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setVipOnly((v) => !v)}
            className={`rounded-xl border px-3 py-2 text-[11px] uppercase tracking-[0.18em] ${
              vipOnly ? 'border-amber-400/50 bg-amber-500/15 text-amber-50' : 'border-white/10 text-zinc-500'
            }`}
          >
            VIP only
          </button>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs uppercase tracking-[0.15em]"
          >
            <option value="ALL">Availability</option>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonPulse key={i} className="h-14 rounded-xl w-full" />
              ))}
            </div>
          ) : (
            <ProfileTable
              profiles={filtered}
              onEdit={(p) => {
                setEditing(p);
                setEditorOpen(true);
              }}
              onDelete={(p) => setPurge(p)}
            />
          )}
        </div>
      </GlassPanel>

      <ProfileFormModal
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditing(null);
        }}
        editing={editing}
      />

      <DeleteConfirmModal
        open={Boolean(purge)}
        onClose={() => setPurge(null)}
        title="Revoke showcase"
        message={
          purge
            ? `Permanently delist ${purge.displayName}? Media ties release from admin graph (demo persistence).`
            : ''
        }
        onConfirm={() => {
          if (purge) {
            deleteProfile(purge.id);
            toast({ title: 'Listing purged', variant: 'danger' });
          }
        }}
      />
    </div>
  );
}
