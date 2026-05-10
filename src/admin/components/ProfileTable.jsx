import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  EyeOff,
  Globe2,
  PencilLine,
  Star,
  Trash2,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { cn } from '../lib/cn.js';

export const ProfileTable = memo(function ProfileTable({
  profiles,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
      <table className="min-w-[980px] w-full border-collapse text-sm">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            <th className="p-4 font-semibold">Showcase</th>
            <th className="p-4 font-semibold hidden sm:table-cell">Metro</th>
            <th className="p-4 font-semibold">Rate</th>
            <th className="p-4 font-semibold hidden md:table-cell">Visibility</th>
            <th className="p-4 font-semibold hidden lg:table-cell">Signals</th>
            <th className="p-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.05]">
          {profiles.map((p, idx) => (
            <motion.tr
              key={p.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              className="bg-white/[0.015] hover:bg-white/[0.04]"
            >
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-11 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
                    {p.avatar ? (
                      <img src={p.avatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-600">
                        —
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{p.displayName}</p>
                    <p className="text-[11px] text-zinc-500">{p.handle}</p>
                    <p className="text-[11px] text-zinc-600 mt-0.5">Age {p.age}</p>
                  </div>
                </div>
              </td>
              <td className="p-4 text-zinc-300 hidden sm:table-cell">{p.city}</td>
              <td className="p-4 text-amber-100">${p.hourlyRate}/h</td>
              <td className="p-4 hidden md:table-cell">
                <span
                  className={cn(
                    'inline-flex rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider border',
                    p.hidden ? 'border-zinc-600 text-zinc-500' : 'border-emerald-500/40 text-emerald-200'
                  )}
                >
                  {p.hidden ? 'hidden' : 'live'}
                </span>
              </td>
              <td className="p-4 hidden lg:table-cell">
                <div className="flex flex-wrap gap-1.5">
                  {p.vip && (
                    <span className="inline-flex rounded-md border border-amber-400/35 bg-amber-500/10 px-1.5 py-0.5 text-amber-100">
                      <Crown className="h-3.5 w-3.5" />
                    </span>
                  )}
                  {p.available ? (
                    <span title="Online" className="text-emerald-300">
                      <Wifi className="h-4 w-4" />
                    </span>
                  ) : (
                    <span title="Offline" className="text-zinc-600">
                      <WifiOff className="h-4 w-4" />
                    </span>
                  )}
                  {p.featured && (
                    <span title="Featured homepage" className="text-yellow-200">
                      <Star className="h-4 w-4 fill-amber-400/30" />
                    </span>
                  )}
                  {!p.hidden ? (
                    <Globe2 className="h-4 w-4 text-sky-300/70" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-zinc-600" />
                  )}
                </div>
              </td>
              <td className="p-4 text-right whitespace-nowrap">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  onClick={() => onEdit?.(p)}
                  className="mr-2 inline-flex items-center rounded-xl border border-amber-500/35 px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] text-amber-100"
                >
                  <PencilLine className="mr-1 h-4 w-4" /> edit
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  onClick={() => onDelete?.(p)}
                  className="inline-flex items-center rounded-xl border border-rose-500/35 px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] text-rose-200"
                >
                  <Trash2 className="mr-1 h-4 w-4" /> del
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      {profiles.length === 0 && (
        <p className="py-14 text-center text-sm text-zinc-500">
          No showcases match filters — widen search or mint a fresh profile.
        </p>
      )}
    </div>
  );
});
