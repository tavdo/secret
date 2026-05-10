import { motion } from 'framer-motion';
import { GripVertical, Trash2 } from 'lucide-react';

export function DraggableGallery({
  urls = [],
  onReorder,
  onRemove,
}) {
  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const from = Number(e.dataTransfer.getData('text/plain'), 10);
    if (Number.isNaN(from) || from === dropIndex || !onReorder) return;
    onReorder(from, dropIndex);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {urls.map((url, idx) => (
        <motion.div
          key={`${url}-${idx}`}
          layout
          initial={{ opacity: 0.6, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          draggable
          onDragStart={(e) => handleDragStart(e, idx)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, idx)}
          className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10 bg-black/45"
        >
          <img
            src={url}
            alt=""
            className="h-full w-full object-cover pointer-events-none"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute left-2 top-2 flex gap-1">
            <span
              className="inline-flex rounded-lg bg-black/60 px-2 py-1 text-amber-200 cursor-grab active:cursor-grabbing"
              title="Drag to reorder"
            >
              <GripVertical className="h-4 w-4" />
            </span>
          </div>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="absolute bottom-2 right-2 rounded-lg bg-rose-500/85 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <span className="absolute bottom-2 left-2 text-[10px] uppercase tracking-widest text-white/70">
            {idx + 1}
          </span>
        </motion.div>
      ))}
      {urls.length === 0 && (
        <p className="col-span-full rounded-xl border border-dashed border-white/15 px-4 py-8 text-center text-sm text-zinc-500">
          Drop zone empty — attach images via upload or paste a URL below.
        </p>
      )}
    </div>
  );
}
