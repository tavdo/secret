import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Link2 } from 'lucide-react';

/**
 * Image picker for admin.
 * Local file picks are blocked until Cloudinary is wired.
 * Persistable images must be https:// URLs.
 */
export function MediaUploader({ onUploaded, compact }) {
  const [urlInput, setUrlInput] = useState('');
  const [hint, setHint] = useState('');

  const filePick = useCallback((e) => {
    const f = e.target.files?.[0];
    if (!f?.type.startsWith('image')) return;
    setHint('ფაილის ატვირთვა ჯერ არაა ჩართული. გამოიყენეთ https:// სურათის ბმული.');
    e.target.value = '';
  }, []);

  const submitUrl = useCallback(() => {
    const t = urlInput.trim();
    if (!/^https?:\/\//i.test(t)) {
      setHint('საჭიროა სრული https:// ბმული.');
      return;
    }
    if (/^blob:/i.test(t)) {
      setHint('blob: ბმულის შენახვა შეუძლებელია.');
      return;
    }
    onUploaded?.(t);
    setUrlInput('');
    setHint('');
  }, [onUploaded, urlInput]);

  return (
    <div className={`space-y-3 ${compact ? '' : ''}`}>
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-amber-500/35 bg-black/35 px-4 py-6 hover:bg-white/[0.03] transition-colors">
        <Upload className="h-8 w-8 text-amber-300 shrink-0" />
        <div>
          <p className="text-sm font-medium text-white">სურათის ატვირთვა</p>
          <p className="text-xs text-zinc-500 mt-1">ჯერჯერობით გამოიყენეთ HTTPS ბმული</p>
        </div>
        <input type="file" accept="image/*" className="hidden" onChange={filePick} />
      </label>
      <div className="flex gap-2">
        <input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://…/photo.jpg"
          className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-amber-400/40"
        />
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={submitUrl}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.18em]"
        >
          <Link2 className="h-4 w-4 text-amber-200" /> ბმული
        </motion.button>
      </div>
      {hint ? <p className="text-xs text-amber-200/80">{hint}</p> : null}
    </div>
  );
}
