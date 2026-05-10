import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { VIP_PROFILES } from '../data/mockData';
import ProfileCard from '../components/common/ProfileCard';

const Explore = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Newest', 'VIP Only', 'Nearby', 'Verified'];

  const filteredProfiles = VIP_PROFILES.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          profile.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || 
                            (activeCategory === 'VIP Only' && profile.is_vip) ||
                            (activeCategory === 'Verified' && profile.is_vip); // Mock logic
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-28 pb-12 px-6">
      <div className="container mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl mb-4">Discover <span className="text-luxury-gold">Elite</span> Companions</h1>
          <p className="text-white/40">Find the perfect companion for your next extraordinary event.</p>
        </header>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, location or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-luxury-gold/50 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
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

          <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-xl text-white/60 hover:text-white transition-all">
            <SlidersHorizontal size={20} />
            <span>Filters</span>
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode='popLayout'>
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

        {filteredProfiles.length === 0 && (
          <div className="text-center py-24">
            <div className="text-white/20 mb-4 flex justify-center">
              <Search size={64} strokeWidth={1} />
            </div>
            <h3 className="text-xl text-white/60">No profiles found matching your criteria.</h3>
            <button 
              onClick={() => {setSearchQuery(''); setActiveCategory('All')}}
              className="mt-4 text-luxury-gold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Load More Mock */}
        <div className="mt-16 text-center">
          <button className="px-12 py-4 glass text-white font-semibold rounded-2xl hover:bg-white/10 transition-all">
            Show More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Explore;
