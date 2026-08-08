import { motion } from 'framer-motion';
import { ShieldCheck, Crown, Lock, Sparkles, Zap } from 'lucide-react';
import ProfileCard from '../components/common/ProfileCard';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';
import { useProfiles } from '../hooks/useProfiles';

const VIPOnly = () => {
  const { profiles: vipProfiles, loading } = useProfiles({
    city: 'Batumi',
    vip: true,
    sort: 'trending',
    take: 48,
  });

  return (
    <div className="min-h-screen pt-28 pb-12 px-6 relative overflow-hidden bg-[#0a0a0a]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-luxury-gold/10 to-transparent pointer-events-none" />
      <div className="absolute top-40 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 glass-dark rounded-full text-luxury-gold border border-luxury-gold/30 mb-8 shadow-[0_0_30px_rgba(212,175,55,0.15)]"
          >
            <Crown size={20} className="fill-luxury-gold" />
            <span className="text-sm font-black uppercase tracking-[0.4em]">The Elite Circle</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl mb-6 font-['Playfair_Display']"
          >
            VIP <span className="gold-text-gradient">Companions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-white/50 text-lg font-light leading-relaxed"
          >
            VIP-marked women offering premium services to clients in Batumi.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { icon: ShieldCheck, label: 'Verified Status' },
            { icon: Lock, label: 'Private Gallery' },
            { icon: Sparkles, label: 'Priority Booking' },
            { icon: Zap, label: 'Direct Concierge' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-dark border-luxury-gold/10 p-4 rounded-2xl flex flex-col items-center gap-2"
            >
              <item.icon size={20} className="text-luxury-gold" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">{item.label}</span>
            </motion.div>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-white/40 py-16">Loading VIP profiles…</p>
        ) : vipProfiles.length === 0 ? (
          <p className="text-center text-white/40 py-16">
            No VIP listings yet. Mark a profile as VIP in the admin panel.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {vipProfiles.map((profile, i) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="relative group"
              >
                <ProfileCard profile={profile} />
                <div className="absolute -inset-1 bg-luxury-gold/5 rounded-[22px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-24 text-center">
          <div className="glass-dark border-luxury-gold/20 p-12 rounded-[40px] max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-luxury-gold/5 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <h2 className="text-3xl mb-4 font-['Playfair_Display']">Want to be listed?</h2>
              <p className="text-white/40 mb-10 max-w-lg mx-auto">
                Register as a provider and continue on WhatsApp for payment instructions.
              </p>
              <Link to="/auth">
                <Button className="px-12 py-5 text-lg">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VIPOnly;
