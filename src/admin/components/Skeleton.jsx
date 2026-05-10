import { motion } from 'framer-motion';
import { cn } from '../lib/cn';

export function SkeletonPulse({ className }) {
  return (
    <div
      className={cn(
        'rounded-lg bg-gradient-to-r from-white/10 via-white/15 to-white/10 bg-[length:200%_100%] animate-[shimmer_1.9s_linear_infinite]',
        className
      )}
      style={{
        animation: 'shimmer 1.9s linear infinite',
      }}
    />
  );
}

/** Add keyframes inline — Tailwind arbitrary keyframes avoided for portability */
export function DashboardSkeletonRows() {
  return (
    <div className="space-y-3">
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0}}
      `}</style>
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <SkeletonPulse className="h-10 w-full" />
        </motion.div>
      ))}
    </div>
  );
}
