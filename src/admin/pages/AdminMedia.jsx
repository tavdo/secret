import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Trash2 } from 'lucide-react';
import { GlassPanel } from '../components/GlassPanel.jsx';
import { MediaUploader } from '../components/MediaUploader.jsx';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal.jsx';
import { TablePagination } from '../components/TablePagination.jsx';
import { useAdminData } from '../context/AdminDataContext.jsx';
import { useAdminToast } from '../context/ToastContext.jsx';

const pageSize = 9;

export function AdminMedia() {
  const { mediaLibrary, profiles, addMedia, deleteMediaById } = useAdminData();
  const { toast } = useAdminToast();
  const [page, setPage] = useState(1);
  const [profileFilter, setProfileFilter] = useState('ALL');
  const [drop, setDrop] = useState(null);

  const filtered = useMemo(() => {
    if (profileFilter === 'ALL') return mediaLibrary;
    return mediaLibrary.filter((m) => m.profileId === profileFilter || m.url.includes(profileFilter));
  }, [mediaLibrary, profileFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const tiles = filtered.slice((page - 1) * pageSize, page * pageSize);

  const lookupName = (pid) =>
    pid ? profiles.find((p) => p.id === pid)?.displayName ?? pid : 'Vault';

  return (
    <div className="space-y-8 pb-28">
      <div>
        <p className="text-[11px] uppercase tracking-[0.38em] text-amber-500/80 font-semibold">
          Artifact vault
        </p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight text-white">Media management</h1>
        <p className="text-sm text-zinc-500 mt-2">
          CDN‑ready ingestion mock — blobs become signed URLs upstream when Axios lands.
        </p>
      </div>

      <GlassPanel hoverGlow className="p-6 md:p-8 grid lg:grid-cols-[minmax(0,320px)_1fr] gap-8">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Ingest rails</p>
          <MediaUploader
            onUploaded={(url) => {
              addMedia({
                url,
                profileId: profileFilter !== 'ALL' ? profileFilter : null,
                label: `Vault drop ${filtered.length + 1}`,
              });
              toast({ title: 'Asset indexed', variant: 'success' });
            }}
          />
          <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-zinc-500">
            <Filter className="h-4 w-4" /> attach drops to
            <select
              value={profileFilter}
              onChange={(e) => {
                setProfileFilter(e.target.value);
                setPage(1);
              }}
              className="flex-1 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs capitalize"
            >
              <option value="ALL">all profiles</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.displayName}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {tiles.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="group relative rounded-2xl border border-white/10 bg-black/40 overflow-hidden"
            >
              <div className="aspect-[4/5] overflow-hidden bg-zinc-900">
                <img src={m.url} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="p-3 space-y-1">
                <p className="text-xs text-white truncate">{m.label}</p>
                <p className="text-[11px] text-zinc-500">{lookupName(m.profileId)}</p>
                <button
                  type="button"
                  onClick={() => setDrop(m)}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.15em] text-rose-300"
                >
                  <Trash2 className="h-3.5 w-3.5" /> purge
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassPanel>

      {filtered.length > pageSize ? (
        <TablePagination page={page} pageCount={pageCount} totalItems={filtered.length} onPageChange={setPage} />
      ) : null}

      <DeleteConfirmModal
        open={Boolean(drop)}
        title="Erase asset"
        message={drop ? `Remove ${drop.label} from CDN index?` : ''}
        onClose={() => setDrop(null)}
        onConfirm={() => {
          if (drop) {
            deleteMediaById(drop.id);
            toast({ title: 'Scrubbed vault entry', variant: 'warn' });
          }
        }}
      />
    </div>
  );
}
