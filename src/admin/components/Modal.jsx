import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { GlassPanel } from './GlassPanel';

const sizeWidths = {
  md: 'max-w-lg',
  lg: 'max-w-3xl',
  xl: 'max-w-6xl',
};

export function Modal({ open, title, subtitle, children, onClose, size = 'md' }) {
  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose?.();
    if (open) window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const node = typeof document !== 'undefined' ? document.body : null;
  if (!node) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[150] flex items-end justify-center p-4 md:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onClose?.()}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className={`relative z-10 w-full ${sizeWidths[size] ?? sizeWidths.md}`}
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <GlassPanel className="border border-white/10">
              <div className="border-b border-white/10 px-6 py-4 flex justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
                  {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => onClose?.()}
                  className="rounded-xl p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors shrink-0 h-fit"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div
              className={`overflow-y-auto p-6 ${size === 'md' ? 'max-h-[min(70vh,520px)]' : 'max-h-[min(88vh,800px)]'}`}
            >
              {children}
            </div>
            </GlassPanel>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    node
  );
}
