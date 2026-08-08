import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

const Favorites = () => {
  return (
    <div className="pt-28 pb-12 px-6">
      <div className="container mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-luxury-gold mb-2">
              <Heart size={20} fill="currentColor" />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">Your Collection</span>
            </div>
            <h1 className="text-4xl md:text-5xl">Saved <span className="text-luxury-gold">Profiles</span></h1>
          </div>
          <p className="text-white/40 max-w-md md:text-right">
            Favorites will appear here once you save companions from Explore.
          </p>
        </header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 glass-dark rounded-[40px] border-white/5"
        >
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-white/20" />
          </div>
          <h3 className="text-2xl mb-4">No favorites yet</h3>
          <p className="text-white/40 mb-8 max-w-sm mx-auto">
            Browse women offering services and save the ones you like.
          </p>
          <Link to="/explore">
            <Button>Explore Profiles</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Favorites;
