import { cn } from '../lib/cn';

export function GlassPanel({ className, children, hoverGlow = false, ...props }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/[0.08] bg-black/35 backdrop-blur-xl',
        'shadow-[inset_0_1px_0_rgba(255,255,255,.06)]',
        hoverGlow &&
          'transition-all duration-500 hover:border-amber-500/25 hover:shadow-[0_0_40px_rgba(212,175,55,.12)]',
        className
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/[0.04] via-transparent to-fuchsia-500/[0.03]" />
      <div className="relative">{children}</div>
    </div>
  );
}
