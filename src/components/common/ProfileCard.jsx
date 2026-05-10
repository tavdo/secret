import { motion } from 'framer-motion';
import { Star, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileCard = ({ profile }) => {
  return (
    <Link to={`/profile/${profile.id}`}>
      <motion.div
        whileHover={{ y: -10 }}
        className="luxury-card group relative aspect-[3/4]"
      >
        <img 
          src={profile.images[0]} 
          alt={profile.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {profile.is_vip && (
            <div className="px-2 py-1 glass-dark text-[10px] font-bold text-luxury-gold flex items-center gap-1 rounded-full uppercase tracking-widest border-luxury-gold/30">
              <ShieldCheck size={12} />
              VIP Elite
            </div>
          )}
          {profile.is_online && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 backdrop-blur-md rounded-full border border-green-500/30">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Online</span>
            </div>
          )}
        </div>

        <button className="absolute top-4 right-4 p-2 glass-dark rounded-full text-white/50 hover:text-red-500 transition-colors">
          <Heart size={18} />
        </button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-6">
          <div className="flex items-end justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-luxury-gold transition-colors">
                {profile.name}, {profile.age}
              </h3>
              <div className="flex items-center gap-1 text-white/60 text-xs mt-1">
                <MapPin size={12} className="text-luxury-gold" />
                {profile.location}
              </div>
            </div>
            <div className="flex items-center gap-1 glass-dark px-2 py-1 rounded-lg border-white/5">
              <Star size={12} className="text-luxury-gold fill-luxury-gold" />
              <span className="text-xs font-bold text-white">{profile.rating}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            {profile.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] font-medium text-white/60 border border-white/10 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-luxury-gold font-bold">{profile.price}</span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">View Profile</span>
          </div>
        </div>

        {/* Scarcity Overlay */}
        {profile.viewers_count > 10 && (
          <div className="absolute top-1/2 left-0 w-full bg-accent-neon/80 backdrop-blur-sm py-1 text-center transform -rotate-12 scale-110 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-black text-white uppercase tracking-tighter">
              {profile.viewers_count} users viewing now
            </span>
          </div>
        )}
      </motion.div>
    </Link>
  );
};

export default ProfileCard;
