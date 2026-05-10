import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, RefreshCw } from 'lucide-react';
import { GlassPanel } from '../components/GlassPanel.jsx';
import { RichTextBioEditor } from '../components/RichTextBioEditor.jsx';
import { DraggableGallery } from '../components/DraggableGallery.jsx';
import { MediaUploader } from '../components/MediaUploader.jsx';
import { useAdminData } from '../context/AdminDataContext.jsx';
import { useAdminToast } from '../context/ToastContext.jsx';

/** CMS cockpit for narrative + gallery choreography without exposing full lattice fields. */
export function AdminContent() {
  const { profiles } = useAdminData();
  const fallback = profiles[0]?.id ?? '';
  const [selectedId, setSelectedId] = useState(fallback);

  const effectiveId = selectedId || fallback;

  return (
    <div className="space-y-8 pb-28">
      <div className="flex flex-wrap gap-6 items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.36em] text-amber-500/80 font-semibold">
            Editorial surface
          </p>
          <h1 className="mt-1 text-4xl font-semibold text-white tracking-tight">Content artisan</h1>
          <p className="text-sm text-zinc-500 mt-2 max-w-2xl">
            Story-first editing with drag-reorder carousel — aligns with Profiles dataset for instant API bridging.
          </p>
        </div>
        <label className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 flex flex-col gap-1">
          Target showcase
          <select
            value={effectiveId || ''}
            onChange={(e) => setSelectedId(e.target.value)}
            className="rounded-xl border border-white/12 bg-black/45 px-4 py-2 text-sm outline-none focus:border-amber-400/40 min-w-[200px]"
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.displayName} · {p.city}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!effectiveId ? (
        <GlassPanel className="p-8">
          <p className="text-zinc-500">Mint at least one showcase to unlock this studio.</p>
        </GlassPanel>
      ) : (
        <ContentStudioBridge key={effectiveId} profileId={effectiveId} />
      )}
    </div>
  );
}

function ContentStudioBridge({ profileId }) {
  const { profiles, updateProfile, addMedia } = useAdminData();
  const { toast } = useAdminToast();
  const profile = profiles.find((p) => p.id === profileId);
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [gallery, setGallery] = useState(() => [...(profile?.gallery ?? [])]);

  if (!profile) {
    return (
      <GlassPanel className="p-8">
        <p className="text-zinc-500">Unknown profile reference.</p>
      </GlassPanel>
    );
  }

  const save = () => {
    const before = new Set(profile.gallery || []);
    updateProfile(profile.id, { bio, gallery });
    gallery.forEach((u) => {
      if (!before.has(u))
        addMedia({
          url: u,
          profileId: profile.id,
          label: `${profile.displayName} CMS slide`,
        });
    });
    toast({ title: 'Narrative published', variant: 'success' });
  };

  const resetDraft = () => {
    setBio(profile.bio);
    setGallery([...(profile.gallery ?? [])]);
  };

  return (
    <GlassPanel hoverGlow className="p-6 md:p-8">
      <div className="flex items-start gap-3 mb-10">
        <Palette className="h-11 w-11 text-violet-200 shrink-0" />
        <div>
          <p className="text-lg font-semibold text-white">{profile.displayName}</p>
          <p className="text-sm text-zinc-500">{profile.handle}</p>
        </div>
      </div>

      <div className="grid xl:grid-cols-12 gap-10">
        <div className="xl:col-span-5 space-y-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Biography CMS</p>
          <RichTextBioEditor value={bio} onChange={setBio} placeholder="Premium narrative prose…" />
        </div>
        <div className="xl:col-span-7 space-y-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Drag-reorder gallery</p>
          <MediaUploader compact onUploaded={(url) => setGallery((g) => [...g, url])} />
          <DraggableGallery
            urls={gallery}
            onReorder={(from, to) => {
              setGallery((prev) => {
                const copy = [...prev];
                const [mv] = copy.splice(from, 1);
                copy.splice(to, 0, mv);
                return copy;
              });
            }}
            onRemove={(idx) => setGallery((g) => g.filter((_, i) => i !== idx))}
          />
        </div>
      </div>

      <div className="mt-12 flex flex-wrap gap-3 justify-end border-t border-white/[0.08] pt-8">
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={resetDraft}
          className="inline-flex items-center gap-2 rounded-xl border border-white/12 px-5 py-2 text-xs uppercase tracking-[0.18em] text-zinc-400"
        >
          <RefreshCw className="h-4 w-4" /> reset draft
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={save}
          className="rounded-xl border border-amber-400/35 bg-gradient-to-r from-amber-400 to-amber-700 px-10 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-black"
        >
          Blast to storefront
        </motion.button>
      </div>
    </GlassPanel>
  );
}
