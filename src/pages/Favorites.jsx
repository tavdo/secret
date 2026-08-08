import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { VIP_PROFILES } from '../data/mockData';
import ProfileCard from '../components/common/ProfileCard';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const favorites = VIP_PROFILES;

  return (
    <div className="pt-28 pb-12 px-6">
      <div className="container mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-luxury-gold mb-2">
              <Heart size={20} fill="currentColor" />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">Your Collection</span>
            </div>
            <h1 className="text-4xl md:text-5xl">Saved <span className="text-luxury-gold">VIPs</span></h1>
          </div>
          <p className="text-white/40 max-w-md md:text-right">
            Manage your personal selection of elite companions. Your favorites are kept private and secure.
          </p>
        </header>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favorites.map((profile, i) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <ProfileCard profile={profile} />
              </motion.div>
            ))}
            
          </div>
        ) : (
          <div className="py-24 glass-dark rounded-3xl text-center border-white/5">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={48} className="text-white/10" />
            </div>
            <h2 className="text-2xl font-bold mb-4">No Favorites Yet</h2>
            <p className="text-white/40 max-w-sm mx-auto mb-10">
              Your collection is empty. Start exploring and save the profiles that catch your eye.
            </p>
            <Link to="/explore">
              <Button className="px-10">Browse Elite Profiles</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
