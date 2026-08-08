import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Phone,
  MessageCircle,
  Banknote,
} from 'lucide-react';
import Button from '../components/common/Button';
import {
  CITY,
  REGISTRATION_FEE_GEL,
  whatsappRegistrationUrl,
} from '../config/site';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const openWhatsAppRegistration = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('გთხოვთ ჩაწეროთ სახელი.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 9) {
      setError('გთხოვთ ჩაწეროთ სწორი ტელეფონის ნომერი.');
      return;
    }
    window.open(
      whatsappRegistrationUrl({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
      }),
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-6 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent-neon/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gold-gradient rounded-2xl flex items-center justify-center shadow-xl shadow-luxury-gold/20">
              <ShieldCheck className="text-black" size={28} />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? 'კეთილი იყოს დაბრუნება' : 'რეგისტრაცია'}
          </h1>
          <p className="text-white/40">
            {isLogin
              ? 'შედით თქვენს პირად ანგარიშში.'
              : `ქალების რეგისტრაცია ${CITY}-ში — შემდეგ გააგრძელეთ WhatsApp-ზე.`}
          </p>
        </div>

        <div className="glass-dark p-8 rounded-3xl border-white/5 relative overflow-hidden">
          {!isLogin && (
            <div className="mb-6 rounded-2xl border border-luxury-gold/30 bg-luxury-gold/10 px-4 py-4">
              <div className="flex items-start gap-3">
                <Banknote className="text-luxury-gold shrink-0 mt-0.5" size={22} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-luxury-gold mb-1">
                    რეგისტრაციის საფასური
                  </p>
                  <p className="text-2xl font-semibold text-white">
                    {REGISTRATION_FEE_GEL}₾
                  </p>
                  <p className="text-sm text-white/55 mt-2 leading-relaxed">
                    გაგზავნის შემდეგ გაიხსნება WhatsApp. იქ გეტყვით ზუსტად,
                    სად გადაიხადოთ {REGISTRATION_FEE_GEL}₾ რეგისტრაციის საფასური.
                    პროფილი გადახდის დადასტურების შემდეგ გამოჩნდება.
                  </p>
                </div>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              className="space-y-5"
              onSubmit={isLogin ? (e) => e.preventDefault() : openWhatsAppRegistration}
            >
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 uppercase tracking-widest px-1">
                      სახელი და გვარი
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="თქვენი სახელი"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-luxury-gold/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 uppercase tracking-widest px-1">
                      ტელეფონი (WhatsApp)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+995 5XX XX XX XX"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-luxury-gold/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 uppercase tracking-widest px-1">
                      ქალაქი
                    </label>
                    <input
                      type="text"
                      value={CITY}
                      readOnly
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white/70 cursor-not-allowed"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-widest px-1">
                  ელფოსტა {isLogin ? '' : '(არასავალდებულო)'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required={isLogin}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-luxury-gold/50 transition-all"
                  />
                </div>
              </div>

              {isLogin && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-white/60 uppercase tracking-widest">
                      პაროლი
                    </label>
                    <button type="button" className="text-[10px] text-luxury-gold hover:underline">
                      დაგავიწყდათ?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:border-luxury-gold/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {error ? (
                <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {error}
                </p>
              ) : null}

              {isLogin ? (
                <Button className="w-full py-4 text-lg flex items-center justify-center gap-2">
                  შესვლა
                  <ArrowRight size={20} />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full py-4 text-lg flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  გაგრძელება WhatsApp-ზე
                </Button>
              )}

              {!isLogin && (
                <p className="text-center text-[11px] text-white/35 leading-relaxed">
                  გაგრძელებით ეთანხმებით, რომ რეგისტრაცია ღირს {REGISTRATION_FEE_GEL}₾ და
                  გადახდის ინსტრუქცია იგზავნება მხოლოდ WhatsApp-ით.
                </p>
              )}
            </motion.form>
          </AnimatePresence>

          <div className="mt-8 text-center border-t border-white/5 pt-8">
            <p className="text-sm text-white/40">
              {isLogin ? 'გსურთ ქალის რეგისტრაცია?' : 'უკვე დარეგისტრირებული ხართ?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-luxury-gold font-bold hover:underline"
              >
                {isLogin ? 'რეგისტრაცია — 600₾' : 'შესვლა'}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 text-white/20">
          <div className="flex items-center gap-1.5">
            <MessageCircle size={14} />
            <span className="text-[10px] uppercase tracking-widest font-bold">WhatsApp გადახდა</span>
          </div>
          <div className="w-1 h-1 bg-white/10 rounded-full" />
          <span className="text-[10px] uppercase tracking-widest font-bold">მხოლოდ {CITY}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
