import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const Button = ({ children, className, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-gold-gradient text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]',
    secondary: 'glass text-white hover:bg-white/10',
    outline: 'border border-luxury-gold/50 text-luxury-gold hover:bg-luxury-gold hover:text-black',
    ghost: 'text-white/70 hover:text-white hover:bg-white/5',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={twMerge(
        'px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
