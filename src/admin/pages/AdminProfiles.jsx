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
  const { profiles, profilesLoading, profilesError, refreshProfiles, deleteProfile } = useAdminData();
  const { toast } = useAdminToast();
  const [q, setQ] = useState('');
  const [city, setCity] = useState('ALL');
  const [availability, setAvailability] = useState('ALL'); // ALL | ONLINE | OFFLINE

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [purge, setPurge] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
      const avail =
        availability === 'ALL' ||
        (availability === 'ONLINE' && p.available) ||
        (availability === 'OFFLINE' && !p.available);
      return hit && met && avail;
    });
  }, [profiles, q, city, availability]);

  return (
    <div className="space-y-8 pb-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.36em] text-amber-500/80 font-semibold">
            Control nucleus
          </p>
          <h1 className="mt-1 text-4xl font-semibold tracking-tight text-white">Profiles</h1>
          <p className="text-sm text-zinc-500 mt-2 max-w-2xl leading-relaxed">
            Add, edit, or remove marketplace profiles. Changes save to the live database.
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
          <Plus className="h-4 w-4" /> Add profile
        </motion.button>
      </div>

      {profilesError ? (
        <GlassPanel className="p-4 border border-rose-500/25">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-rose-200">{profilesError}</p>
            <button
              type="button"
              onClick={() => refreshProfiles()}
              className="rounded-xl border border-white/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-zinc-300"
            >
              Retry
            </button>
          </div>
        </GlassPanel>
      ) : null}

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
          {profilesLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonPulse key={i} className="h-14 rounded-xl w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-zinc-500">
              No profiles yet. Click <span className="text-amber-200">Add profile</span> to create one.
            </p>
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
        onClose={() => (!deleting ? setPurge(null) : null)}
        title="Delete profile"
        message={
          purge
            ? `Permanently delete ${purge.displayName}? This removes the provider account and listing.`
            : ''
        }
        onConfirm={async () => {
          if (!purge) return;
          setDeleting(true);
          try {
            await deleteProfile(purge.id);
            toast({ title: 'Profile deleted', variant: 'danger' });
            setPurge(null);
          } catch (err) {
            toast({
              title: err?.response?.data?.error || err?.message || 'Delete failed',
              variant: 'danger',
            });
          } finally {
            setDeleting(false);
          }
        }}
      />
    </div>
  );
}
