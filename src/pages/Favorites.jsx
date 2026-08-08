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
              <span className="text-xs font-bold uppercase tracking-[0.3em]">თქვენი კოლექცია</span>
            </div>
            <h1 className="text-4xl md:text-5xl">შენახული <span className="text-luxury-gold">პროფილები</span></h1>
          </div>
          <p className="text-white/40 max-w-md md:text-right">
            რჩეულები აქ გამოჩნდება, როცა ძებნიდან შეინახავთ თანმხლებებს.
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
          <h3 className="text-2xl mb-4">რჩეულები ჯერ ცარიელია</h3>
          <p className="text-white/40 mb-8 max-w-sm mx-auto">
            დაათვალიერეთ ქალები, რომლებიც სერვისს სთავაზობენ და შეინახეთ სასურველები.
          </p>
          <Link to="/explore">
            <Button>პროფილების ნახვა</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Favorites;
