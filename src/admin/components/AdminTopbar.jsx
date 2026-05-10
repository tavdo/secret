import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Menu, Radar, Search, Sparkles } from "lucide-react";
import { GlassPanel } from "./GlassPanel";
import { cn } from "../lib/cn";
import { useLivePulse } from "../hooks/useLivePulse";
import { activityFeed } from "../data/mockAdminData";
import { useAdminToast } from "../context/ToastContext";

export function AdminTopbar({ onOpenMobile }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const online = useLivePulse(487, 0.15);
  const { toast } = useAdminToast();
  const path = typeof window !== "undefined" ? window.location.pathname.replace(/^\//, "") : "";

  const inbox = useMemo(
    () =>
      activityFeed.slice(0, 5).map((a) => ({
        id: a.id,
        title: a.actor,
        sub: a.summary,
        ts: a.ts,
      })),
    []
  );

  return (
    <GlassPanel className="sticky top-0 z-[90] mx-4 mt-4 border border-white/[0.1] rounded-2xl md:rounded-3xl mb-6">
      <div className="flex flex-wrap items-center gap-4 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={() => onOpenMobile()}
            className="md:hidden inline-flex rounded-xl border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10 transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden md:flex rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-amber-200/85 font-semibold">
            LIVE
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-500 font-medium truncate">
              /admin{path ? ` › ${path}` : ""}
            </p>
            <div className="flex items-center gap-2 flex-wrap mt-0.5">
              <Radar className="h-4 w-4 text-emerald-400 animate-pulse" aria-hidden />
              <span className="text-lg font-semibold text-white tracking-tight">
                Companion operators console
              </span>
              <span className="text-sm text-zinc-400 tabular-nums">
                <span className="text-emerald-300">{online}</span> live
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto justify-between md:justify-end">
          <div className="relative flex items-center rounded-xl border border-white/10 bg-black/35 px-3 py-2 min-w-[12rem]">
            <Search className="h-4 w-4 text-zinc-500" />
            <input
              type="search"
              placeholder="Search profiles, bookings..."
              className="ml-2 flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  toast({
                    title: "Search routes to wired API.",
                    variant: "default",
                  });
              }}
            />
          </div>

          <div className="relative">
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "relative rounded-xl border border-white/10 bg-black/35 p-2.5 hover:border-amber-400/35 transition-colors",
                notifOpen && "border-amber-400/50 shadow-[0_0_22px_rgba(212,175,55,.2)]"
              )}
              onClick={() => setNotifOpen((x) => !x)}
              aria-expanded={notifOpen}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-zinc-200" />
              <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold px-1 text-white shadow-[0_0_12px_rgba(244,63,94,.6)]">
                3
              </span>
            </motion.button>
            <AnimatePresence>
              {notifOpen && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-[95]"
                    aria-label="Dismiss panel"
                    onClick={() => setNotifOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 mt-3 z-[100] w-[min(94vw,20rem)] rounded-2xl border border-white/15 bg-zinc-950/95 backdrop-blur-2xl shadow-2xl overflow-hidden"
                  >
                    <div className="border-b border-white/10 px-4 py-3 flex justify-between items-center">
                      <p className="text-sm font-semibold text-white">Control center</p>
                      <Sparkles className="h-4 w-4 text-amber-300" />
                    </div>
                    <div className="max-h-[17rem] overflow-y-auto divide-y divide-white/[0.06]">
                      {inbox.map((n) => (
                        <button
                          type="button"
                          key={n.id}
                          className="w-full text-left px-4 py-3 text-sm transition-colors hover:bg-white/[0.04]"
                          onClick={() => {
                            toast({ title: `${n.title}`, variant: "success" });
                            setNotifOpen(false);
                          }}
                        >
                          <p className="font-medium text-zinc-100">{n.title}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{n.sub}</p>
                          <p className="text-[10px] mt-2 uppercase tracking-[0.2em] text-zinc-600">{n.ts}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/"
            className="hidden lg:inline-flex text-[10px] uppercase tracking-[0.25em] text-zinc-500 hover:text-amber-200 px-2"
          >
            Exit
          </Link>
        </div>
      </div>
    </GlassPanel>
  );
}
