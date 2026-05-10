import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-luxury-dark text-white selection:bg-luxury-gold selection:text-black">
      <Navbar />
      <main className="flex-grow pb-20 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
      <div className="bg-glow" />
    </div>
  );
};

export default Layout;
