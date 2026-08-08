import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, MessageSquare, User, Heart } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();

  const items = [
    { icon: Home, path: '/', label: 'მთავარი' },
    { icon: Search, path: '/explore', label: 'ძებნა' },
    { icon: MessageSquare, path: '/messages', label: 'ჩატი' },
    { icon: Heart, path: '/favorites', label: 'რჩეული' },
    { icon: User, path: '/auth', label: 'პროფილი' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-50 glass-dark border-t border-white/5 pb-safe">
      <div className="flex items-center justify-around py-3 px-2">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.path}
              className="relative flex flex-col items-center gap-1 min-w-[64px]"
            >
              <motion.div
                animate={isActive ? { scale: 1.2, y: -2 } : { scale: 1, y: 0 }}
                className={`${isActive ? 'text-luxury-gold' : 'text-white/40'}`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-luxury-gold opacity-100' : 'text-white/40 opacity-0'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottomNavTab"
                  className="absolute -top-3 w-8 h-1 bg-luxury-gold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.8)]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
