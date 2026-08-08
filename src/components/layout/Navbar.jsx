import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart } from 'lucide-react';
import Button from '../common/Button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'ძებნა', path: '/explore' },
    { name: 'რჩეულები', path: '/favorites' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'py-4 glass-dark' : 'py-6 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 10 }}
            transition={{ repeat: Infinity, duration: 4, repeatType: 'reverse' }}
            className="w-10 h-10 bg-gold-gradient rounded-full flex items-center justify-center shadow-lg shadow-luxury-gold/20"
          >
            <span className="text-black font-bold text-xl">S</span>
          </motion.div>
          <span className="text-2xl font-['Playfair_Display'] font-bold tracking-tighter text-white">
            SECRET
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-luxury-gold ${
                location.pathname === link.path ? 'text-luxury-gold' : 'text-white/80'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/favorites"
            className="p-2 text-white/70 hover:text-white transition-colors"
            aria-label="favorites"
          >
            <Heart size={20} />
          </Link>
          <Link to="/auth">
            <Button variant="outline" className="py-2 px-6">
              რეგისტრაცია
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden p-2 text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="menu"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full glass-dark py-8 flex flex-col items-center gap-6 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-white/80 hover:text-luxury-gold"
              >
                {link.name}
              </Link>
            ))}
            <Link to="/auth" className="w-full px-6" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full">რეგისტრაცია</Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
