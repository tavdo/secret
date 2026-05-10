import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import { VIP_PROFILES } from '../data/mockData';
import ProfileCard from '../components/common/ProfileCard';
import Button from '../components/common/Button';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-luxury-expensive-watch-at-a-party-34538-large.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="container mx-auto px-6 relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-luxury-gold text-xs font-bold uppercase tracking-[0.3em] mb-6">
              <Sparkles size={14} /> The World's Most Exclusive Marketplace
            </span>
            <h1 className="text-5xl md:text-8xl mb-8 leading-tight">
              Elevate Your <br />
              <span className="gold-text-gradient">Experience</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-white/60 mb-10 font-light leading-relaxed">
              Connect with elite companions who redefine luxury. Unparalleled sophistication, 
              absolute discretion, and unforgettable moments await you.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Button className="px-10 py-5 text-lg">Explore VIP Profiles</Button>
              <Button variant="ghost" className="flex items-center gap-2 group">
                Become a Member <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Hero Stats */}
        <div className="absolute bottom-10 left-0 w-full z-20 hidden md:block">
          <div className="container mx-auto px-6 flex justify-between items-end">
            <div className="flex gap-12">
              {[
                { label: 'VIP Models', value: '500+' },
                { label: 'Cities', value: '45' },
                { label: 'Private Jets', value: '12' },
              ].map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-24 bg-luxury-dark relative">
        <div className="container mx-auto px-6 mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-4xl mb-2">Trending <span className="text-luxury-gold">VIPs</span></h2>
            <p className="text-white/40">The most sought-after companions of the week.</p>
          </div>
          <Button variant="outline" className="hidden md:flex">View All</Button>
        </div>

        <div className="px-6 md:px-0">
          <Swiper
            modules={[Autoplay, Pagination, EffectCoverflow]}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            coverflowEffect={{
              rotate: 5,
              stretch: 0,
              depth: 100,
              modifier: 2,
              slideShadows: true,
            }}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            className="vip-swiper pb-20"
          >
            {VIP_PROFILES.map((profile) => (
              <SwiperSlide key={profile.id} className="max-w-[350px]">
                <ProfileCard profile={profile} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Features/Trust Section */}
      <section className="py-24 glass-dark border-y border-white/5">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
          {[
            { 
              icon: ShieldCheck, 
              title: 'Total Discretion', 
              desc: 'Encrypted communications and anonymous payment methods for your privacy.' 
            },
            { 
              icon: Zap, 
              title: 'Verified Only', 
              desc: 'Every profile undergoes a rigorous 3-step verification process for your safety.' 
            },
            { 
              icon: Star, 
              title: 'Concierge Service', 
              desc: 'Dedicated 24/7 support to ensure every detail of your meeting is perfect.' 
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="text-center px-8"
            >
              <div className="w-16 h-16 bg-luxury-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-luxury-gold/20">
                <item.icon className="text-luxury-gold" size={32} />
              </div>
              <h3 className="text-xl mb-4">{item.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Floating CTA */}
      <motion.div 
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        className="fixed right-6 bottom-24 md:bottom-10 z-40 hidden md:block"
      >
        <Button className="rounded-full w-14 h-14 p-0 flex items-center justify-center shadow-2xl">
          <Zap size={24} fill="currentColor" />
        </Button>
      </motion.div>
    </div>
  );
};

export default Home;
