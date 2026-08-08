import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProfileCard from '../components/common/ProfileCard';
import { useProfiles } from '../hooks/useProfiles';

const Explore = () => {
  const [activeCategory, setActiveCategory] = useState('ყველა');
  const [searchQuery, setSearchQuery] = useState('');
  const { profiles, loading, error } = useProfiles({ city: 'Batumi', sort: 'trending', take: 60 });

  const categories = ['ყველა', 'ხელმისაწვდომი', 'მხოლოდ VIP', 'ვერიფიცირებული'];

  const filteredProfiles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return profiles.filter((profile) => {
      const hay = `${profile.name} ${profile.location} ${profile.tags.join(' ')} ${profile.servicesText}`.toLowerCase();
      const matchesSearch = !q || hay.includes(q);
      const matchesCategory =
        activeCategory === 'ყველა' ||
        (activeCategory === 'მხოლოდ VIP' && profile.is_vip) ||
        (activeCategory === 'ხელმისაწვდომი' && profile.is_online) ||
        (activeCategory === 'ვერიფიცირებული' && profile.is_vip);
      return matchesSearch && matchesCategory;
    });
  }, [profiles, searchQuery, activeCategory]);

  return (
    <div className="pt-28 pb-12 px-6">
      <div className="container mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl mb-4">
            აღმოაჩინე <span className="text-luxury-gold">თანმხლებები</span>
          </h1>
          <p className="text-white/40">
            ბათუმში ქალები, რომლებიც კლიენტებს სერვისს სთავაზობენ — ტარიფები, ხელმისაწვდომობა და შეთავაზებები.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              placeholder="ძებნა სახელით, სერვისით ან ლოკაციით..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-luxury-gold/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/20'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-xl text-white/60 hover:text-white transition-all"
          >
            <SlidersHorizontal size={20} />
            <span>ფილტრები</span>
          </button>
        </div>

        {loading && <p className="text-center text-white/40 py-16">პროფილები იტვირთება…</p>}
        {error && !loading && (
          <p className="text-center text-red-300/80 py-8">{error}</p>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProfiles.map((profile, i) => (
                <motion.div
                  key={profile.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <ProfileCard profile={profile} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredProfiles.length === 0 && (
          <div className="text-center py-24">
            <div className="text-white/20 mb-4 flex justify-center">
              <Search size={64} strokeWidth={1} />
            </div>
            <h3 className="text-xl text-white/60">თქვენს კრიტერიუმებს პროფილი არ ემთხვევა.</h3>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('ყველა');
              }}
              className="mt-4 text-luxury-gold hover:underline"
            >
              ფილტრების გასუფთავება
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
