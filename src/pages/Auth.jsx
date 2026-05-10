import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-6 relative overflow-hidden">
      {/* Background Decoration */}
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
            {isLogin ? 'Welcome Back' : 'Join the Elite'}
          </h1>
          <p className="text-white/40">
            {isLogin ? 'Access your private luxury marketplace.' : 'Create an account to unlock VIP features.'}
          </p>
        </div>

        <div className="glass-dark p-8 rounded-3xl border-white/5 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.form 
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              className="space-y-6"
            >
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/60 uppercase tracking-widest px-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="text" 
                      placeholder="Your Name"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-luxury-gold/50 transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-widest px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    type="email" 
                    placeholder="email@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-luxury-gold/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Password</label>
                  {isLogin && (
                    <button type="button" className="text-[10px] text-luxury-gold hover:underline">Forgot?</button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
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

              {isLogin && (
                <div className="flex items-center gap-3 px-1">
                  <input type="checkbox" className="accent-luxury-gold w-4 h-4 rounded" />
                  <span className="text-xs text-white/40">Remember me for 30 days</span>
                </div>
              )}

              <Button className="w-full py-4 text-lg flex items-center justify-center gap-2">
                {isLogin ? 'Enter The Vault' : 'Establish Membership'}
                <ArrowRight size={20} />
              </Button>
            </motion.form>
          </AnimatePresence>

          <div className="mt-8 text-center border-t border-white/5 pt-8">
            <p className="text-sm text-white/40">
              {isLogin ? "Don't have an account?" : "Already a member?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-luxury-gold font-bold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 flex items-center justify-center gap-4 text-white/20">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} />
            <span className="text-[10px] uppercase tracking-widest font-bold">256-bit Encryption</span>
          </div>
          <div className="w-1 h-1 bg-white/10 rounded-full" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Privacy Guaranteed</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
