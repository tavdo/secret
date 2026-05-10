import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function TablePagination({
  page,
  pageCount,
  onPageChange,
  totalItems,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4">
      <p className="text-xs text-zinc-500 uppercase tracking-[0.2em]">
        Showing page {page} of {pageCount} ({totalItems} rows)
      </p>
      <div className="flex items-center gap-2">
        <motion.button
          type="button"
          disabled={page <= 1}
          whileHover={{ scale: page <= 1 ? 1 : 1.04 }}
          whileTap={{ scale: page <= 1 ? 1 : 0.96 }}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 text-xs text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-amber-400/35"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </motion.button>
        <motion.button
          type="button"
          disabled={page >= pageCount}
          whileHover={{ scale: page >= pageCount ? 1 : 1.04 }}
          whileTap={{ scale: page >= pageCount ? 1 : 0.96 }}
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
          className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 text-xs text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-amber-400/35"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}
