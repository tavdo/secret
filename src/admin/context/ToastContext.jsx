/* eslint-disable react-refresh/only-export-components -- toast provider + hook */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../lib/cn';

const ToastCtx = createContext(null);

let idCounter = 0;

export function AdminToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const toast = useCallback(({ title, variant = 'default', duration = 3600 }) => {
    idCounter += 1;
    const id = String(idCounter);
    const item = { id, title, variant };
    setItems((prev) => [...prev, item]);
    if (duration) {
      setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), duration);
    }
    return id;
  }, []);

  const remove = useCallback((id) => setItems((prev) => prev.filter((x) => x.id !== id)), []);

  const value = useMemo(() => ({ toast, remove }), [toast, remove]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fixed top-24 right-4 md:right-8 z-[200] flex flex-col gap-2 max-w-[min(100vw-2rem,22rem)]">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
              className={cn(
                'relative overflow-hidden rounded-xl border backdrop-blur-xl px-4 py-3 shadow-2xl',
                'bg-zinc-900/95 border-white/10',
                t.variant === 'success' && 'border-emerald-500/40 shadow-[0_0_24px_rgba(16,185,129,.18)]',
                t.variant === 'warn' && 'border-amber-500/35 shadow-[0_0_24px_rgba(245,158,11,.14)]',
                t.variant === 'danger' && 'border-rose-500/35 shadow-[0_0_24px_rgba(244,63,94,.14)]'
              )}
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-amber-500/5 via-transparent to-fuchsia-500/5" />
              <button
                type="button"
                onClick={() => remove(t.id)}
                className="absolute top-2 right-2 rounded-lg p-1 text-zinc-500 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-start gap-3 pr-6">
                {t.variant === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
                {t.variant === 'warn' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
                {t.variant === 'danger' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
                {(t.variant === 'default' || !t.variant) && <Info className="w-5 h-5 text-amber-300/90 shrink-0 mt-0.5" />}
                <p className="text-sm text-zinc-100 leading-snug font-medium">{t.title}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

export function useAdminToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useAdminToast must be used inside AdminToastProvider');
  return ctx;
}
