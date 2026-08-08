import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';
import { GlassPanel } from '../components/GlassPanel.jsx';

export function AdminLogin() {
  const { isAuthenticated, login, bootstrap } = useAdminAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // login | bootstrap
  const [email, setEmail] = useState('admin@esc.com');
  const [password, setPassword] = useState('admin123');
  const [displayName, setDisplayName] = useState('Admin');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin/profiles" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'bootstrap') {
        await bootstrap({ email, password, displayName });
      } else {
        await login(email, password);
      }
      navigate('/admin/profiles', { replace: true });
    } catch (err) {
      const msg =
        err?.code === 'NOT_ADMIN'
          ? 'ეს ანგარიში ადმინი არ არის.'
          : err?.response?.data?.error || err?.message || 'შესვლა ვერ მოხერხდა';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-[20%] right-[-10%] h-[420px] w-[420px] rounded-full blur-[140px] bg-amber-500/[0.1]" />
      <div className="pointer-events-none absolute bottom-[-15%] left-[-10%] h-[360px] w-[360px] rounded-full blur-[120px] bg-fuchsia-500/[0.06]" />

      <GlassPanel className="relative z-[1] w-full max-w-md p-8 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-2.5">
            <Shield className="h-5 w-5 text-amber-300" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-amber-500/80 font-semibold">
              კონტროლის პანელი
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">ადმინის შესვლა</h1>
          </div>
        </div>

        <div className="mb-5 flex gap-2">
          <ModeTab active={mode === 'login'} onClick={() => setMode('login')}>
            შესვლა
          </ModeTab>
          <ModeTab active={mode === 'bootstrap'} onClick={() => setMode('bootstrap')}>
            პირველი ადმინი
          </ModeTab>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === 'bootstrap' ? (
            <Field label="სახელი">
              <input
                className={inputCls}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </Field>
          ) : null}
          <Field label="ელფოსტა">
            <input
              type="email"
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field label="პაროლი">
            <input
              type="password"
              className={inputCls}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </Field>

          {mode === 'bootstrap' ? (
            <p className="text-xs text-zinc-500 leading-relaxed">
              ქმნის პირველ ადმინს, თუ არცერთი არ არსებობს. გამოიყენეთ ერთხელ, შემდეგ შედით ჩვეულებრივად.
            </p>
          ) : null}

          {error ? (
            <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {error}
            </p>
          ) : null}

          <motion.button
            type="submit"
            disabled={busy}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-xl border border-amber-400/40 bg-gradient-to-r from-amber-500/90 to-yellow-700/85 px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-black disabled:opacity-60"
          >
            {busy ? 'მიმდინარეობს…' : mode === 'bootstrap' ? 'ადმინის შექმნა' : 'შესვლა'}
          </motion.button>
        </form>
      </GlassPanel>
    </div>
  );
}

function ModeTab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-xl border px-3 py-2 text-[11px] uppercase tracking-[0.18em] ${
        active
          ? 'border-amber-400/45 bg-amber-500/15 text-amber-50'
          : 'border-white/10 text-zinc-500'
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  'w-full rounded-xl border border-white/10 bg-black/45 px-3 py-2.5 text-sm outline-none focus:border-amber-400/40';
