import { useEffect, useState } from 'react';
import { animate, motion } from 'framer-motion';
import { GlassPanel } from './GlassPanel';
import { cn } from '../lib/cn';

export function StatCard({ label, value, prefix = '', suffix = '', trend, icon: Icon, neon }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const c = animate(0, value, {
      duration: 1.15,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => c.stop();
  }, [value]);

  return (
    <GlassPanel hoverGlow className={cn(neon && 'ring-1 ring-amber-500/20 shadow-[0_0_30px_rgba(212,175,55,.1)]')}>
      <motion.div layout className="p-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-medium">{label}</p>
            <p className="mt-2 text-3xl md:text-[1.95rem] font-semibold tracking-tight text-white tabular-nums">
              {prefix}
              {Math.round(display).toLocaleString()}
              {suffix}
            </p>
            {trend !== undefined && (
              <p
                className={cn(
                  'mt-1 text-xs font-medium',
                  trend >= 0 ? 'text-emerald-400' : 'text-rose-400'
                )}
              >
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last period
              </p>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10 shadow-[0_0_16px_rgba(212,175,55,.2)]">
            <Icon className="h-5 w-5 text-amber-200" aria-hidden />
          </div>
        </div>
      </motion.div>
    </GlassPanel>
  );
}
