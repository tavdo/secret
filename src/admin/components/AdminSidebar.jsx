import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  AlignLeft,
  BarChart3,
  CalendarRange,
  Contact,
  Crown,
  Images,
  LayoutDashboard,
  MessageSquareWarning,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  ShieldAlert,
  Users,
  X,
} from 'lucide-react';
import { cn } from '../lib/cn';

const STORAGE = 'admin-sidebar-collapsed';

const links = [
  { to: '/admin', end: true, label: 'მიმოხილვა', Icon: LayoutDashboard },
  { to: '/admin/profiles', label: 'პროფილები', Icon: Contact },
  { to: '/admin/content', label: 'კონტენტი', Icon: AlignLeft },
  { to: '/admin/media', label: 'მედია', Icon: Images },
  { to: '/admin/analytics', label: 'ანალიტიკა', Icon: BarChart3 },
  { to: '/admin/users', label: 'მომხმარებლები', Icon: Users },
  { to: '/admin/bookings', label: 'ჯავშნები', Icon: CalendarRange },
  { to: '/admin/vip', label: 'VIP და ტიერები', Icon: Crown },
  { to: '/admin/moderation', label: 'მოდერაცია', Icon: ShieldAlert },
  { to: '/admin/messaging', label: 'შეტყობინებები', Icon: MessageSquareWarning },
  { to: '/admin/reports', label: 'რეპორტები', Icon: Activity },
];

function NavRows({ collapsed, onNavigate }) {
  return (
    <div className="space-y-1 px-2">
      {links.map(({ to, end, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          title={collapsed ? label : undefined}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
              collapsed && 'justify-center px-0',
              isActive
                ? 'border border-amber-500/30 bg-gradient-to-r from-amber-500/20 to-transparent text-amber-50 shadow-[0_0_22px_rgba(212,175,55,.12)]'
                : 'border border-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-white'
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0',
                  isActive ? 'text-amber-200' : 'text-zinc-500 group-hover:text-amber-200/70'
                )}
              />
              {!collapsed && <span>{label}</span>}
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}

export function AdminSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen, onLogout }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const v = localStorage.getItem(STORAGE);
    if (v !== null) setCollapsed(v === '1');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE, collapsed ? '1' : '0');
  }, [collapsed]);

  useEffect(() => setMobileOpen(false), [pathname, setMobileOpen]);

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? '4.85rem' : '16rem' }}
        transition={{ type: 'spring', stiffness: 360, damping: 38 }}
        className={cn(
          'fixed inset-y-0 left-0 z-[120] hidden md:flex md:flex-col',
          'border-r border-white/[0.08] bg-zinc-950/85 backdrop-blur-2xl',
          '[box-shadow:inset_-1px_0_0_rgba(255,255,255,.04)]'
        )}
      >
        <div className="flex h-14 items-center justify-between gap-2 border-b border-white/[0.06] px-3">
          {!collapsed ? (
            <div className="pl-2 pb-2 pt-1">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-amber-500/80">
                Command
              </p>
              <p className="text-xs font-semibold tracking-wide text-zinc-100">Nova Admin</p>
            </div>
          ) : (
            <div className="mx-auto h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-800 opacity-95 shadow-[0_0_18px_rgba(212,175,55,.45)]" />
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            title="Toggle sidebar"
            className="rounded-lg p-2 text-zinc-500 hover:bg-white/[0.07] hover:text-amber-200 transition-colors shrink-0"
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {!collapsed && (
            <p className="px-5 pb-3 text-[0.58rem] font-semibold uppercase tracking-[0.3em] text-zinc-600">
              Navigate
            </p>
          )}
          <NavRows collapsed={collapsed} />
        </nav>
        <div className="border-t border-white/[0.06] px-3 py-3 space-y-2">
          {onLogout ? (
            <button
              type="button"
              onClick={onLogout}
              title="Sign out"
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border border-white/10 px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-100',
                collapsed && 'justify-center px-0'
              )}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Sign out</span>}
            </button>
          ) : null}
          {!collapsed ? (
            <p className="px-1 text-[11px] leading-snug text-zinc-600">Live profile control · Postgres API</p>
          ) : null}
        </div>
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="shade"
              className="fixed inset-0 z-[125] bg-black/65 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <motion.aside
              key="drawer"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 28, stiffness: 290 }}
              className="fixed inset-y-0 left-0 z-[130] flex w-[17rem] flex-col border-r border-white/[0.1] bg-zinc-950 md:hidden backdrop-blur-2xl"
            >
              <div className="flex h-14 items-center justify-between border-b border-white/[0.06] px-4">
                <span className="text-sm font-semibold text-white">Nova Admin</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-white/[0.08] hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 space-y-1">
                <NavRows collapsed={false} onNavigate={() => setMobileOpen(false)} />
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}