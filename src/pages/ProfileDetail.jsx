import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, Star, MapPin, Heart, 
  MessageSquare, Calendar, Lock, Share2, Info 
} from 'lucide-react';
import { VIP_PROFILES } from '../data/mockData';
import Button from '../components/common/Button';
import ProfileCard from '../components/common/ProfileCard';

const ProfileDetail = () => {
  const { id } = useParams();
  const profile = VIP_PROFILES.find(p => p.id === parseInt(id));

  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="pt-20 pb-12">
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <Link to="/explore" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors">
          <ChevronLeft size={20} /> Back to Explore
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Gallery & About */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 gap-4 mb-8">
              {profile.images.map((img, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative overflow-hidden rounded-3xl ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={profile.name} />
                </motion.div>
              ))}
              
              {/* Premium Locked Content */}
              <div className="col-span-2 relative group cursor-pointer overflow-hidden rounded-3xl aspect-video">
                <img 
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800" 
                  className="w-full h-full object-cover blur-2xl grayscale brightness-50 transition-all duration-700 group-hover:scale-110" 
                  alt="Premium" 
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/40">
                  <div className="w-16 h-16 bg-luxury-gold/20 rounded-full flex items-center justify-center mb-4 border border-luxury-gold/50 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                    <Lock className="text-luxury-gold" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Premium Gallery Locked</h3>
                  <p className="text-white/60 mb-6 max-w-sm">Unlock access to 15+ exclusive premium photos and videos of {profile.name}.</p>
                  <Button className="px-8">Unlock VIP Access</Button>
                </div>
              </div>
            </div>

            <div className="glass-dark p-8 rounded-3xl border-white/5 mb-8">
              <h2 className="text-2xl mb-4">About <span className="text-luxury-gold">{profile.name}</span></h2>
              <p className="text-white/60 leading-relaxed text-lg mb-8">{profile.about}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Ethnicity', value: 'Caucasian' },
                  { label: 'Eyes', value: 'Emerald' },
                  { label: 'Height', value: '175 cm' },
                  { label: 'Weight', value: '55 kg' },
                ].map(info => (
                  <div key={info.label}>
                    <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">{info.label}</div>
                    <div className="text-white font-medium">{info.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Profiles */}
            <div className="mt-16">
              <h2 className="text-2xl mb-8">Similar <span className="text-luxury-gold">Companions</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {VIP_PROFILES.filter(p => p.id !== profile.id).slice(0, 3).map(p => (
                  <ProfileCard key={p.id} profile={p} />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Booking Sticky */}
          <div className="lg:col-span-4">
            <div className="sticky top-28">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-dark border-luxury-gold/20 border p-8 rounded-3xl"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-3xl font-bold mb-1">{profile.name}</h1>
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <MapPin size={14} className="text-luxury-gold" />
                      {profile.location}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-luxury-gold mb-1">
                      <Star size={16} fill="currentColor" />
                      <span className="font-bold">{profile.rating}</span>
                    </div>
                    <span className="text-[10px] text-white/40">{profile.reviews_count} Reviews</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {profile.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold text-luxury-gold/80 border border-luxury-gold/20 px-3 py-1 rounded-full uppercase tracking-tighter">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-white/60">Rate</span>
                    <span className="text-xl font-bold text-luxury-gold">{profile.price}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-white/60">Travel Fee</span>
                    <span className="text-white font-medium">Negotiable</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-white/60">Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-400 font-bold text-xs uppercase">Online Now</span>
                    </div>
                  </div>
                </div>

                {/* Scarcity */}
                <div className="bg-luxury-gold/10 border border-luxury-gold/30 rounded-2xl p-4 mb-8 flex items-center gap-4">
                  <div className="text-luxury-gold">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-luxury-gold">High Demand</div>
                    <div className="text-[10px] text-luxury-gold/70">Only {profile.spots_left} spots left this week!</div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Button className="w-full py-4 text-lg flex items-center justify-center gap-2">
                    <Calendar size={20} /> Book Now
                  </Button>
                  <Link to="/messages" className="w-full">
                    <Button variant="outline" className="w-full py-4 flex items-center justify-center gap-2">
                      <MessageSquare size={20} /> Message
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 flex items-center justify-center gap-8 border-t border-white/5 pt-8">
                  <button className="flex flex-col items-center gap-2 text-white/40 hover:text-luxury-gold transition-colors">
                    <Heart size={20} />
                    <span className="text-[10px] uppercase">Favorite</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 text-white/40 hover:text-luxury-gold transition-colors">
                    <Share2 size={20} />
                    <span className="text-[10px] uppercase">Share</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 text-white/40 hover:text-luxury-gold transition-colors">
                    <Info size={20} />
                    <span className="text-[10px] uppercase">Details</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
