import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import ProfileCard from '../components/common/ProfileCard';
import Button from '../components/common/Button';
import { useProfiles } from '../hooks/useProfiles';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Star } from 'lucide-react';

const Home = () => {
  const { profiles, loading } = useProfiles({ city: 'Batumi', sort: 'trending', take: 12 });

  return (
    <div className="overflow-hidden">
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
              <Sparkles size={14} /> Women offering services in Batumi
            </span>
            <h1 className="text-5xl md:text-8xl mb-8 leading-tight">
              Elevate Your <br />
              <span className="gold-text-gradient">Experience</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-white/60 mb-10 font-light leading-relaxed">
              Browse verified women who offer companionship and personal services to clients.
              Discretion, clarity, and real listings — managed from the admin panel.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Link to="/explore">
                <Button className="px-10 py-5 text-lg">Explore Profiles</Button>
              </Link>
              <Link to="/auth">
                <Button variant="ghost" className="flex items-center gap-2 group">
                  Register as Provider <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-0 w-full z-20 hidden md:block">
          <div className="container mx-auto px-6 flex justify-between items-end">
            <div className="flex gap-12">
              {[
                { label: 'Active listings', value: loading ? '…' : String(profiles.length) },
                { label: 'City', value: 'Batumi' },
                { label: 'Status', value: 'Live' },
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

      <section className="py-24 bg-luxury-dark relative">
        <div className="container mx-auto px-6 mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-4xl mb-2">Featured <span className="text-luxury-gold">Companions</span></h2>
            <p className="text-white/40">Women currently offering services to clients in Batumi.</p>
          </div>
          <Link to="/explore" className="hidden md:block">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="px-6 md:px-0">
          {loading ? (
            <p className="text-center text-white/40 py-16">Loading profiles…</p>
          ) : profiles.length === 0 ? (
            <p className="text-center text-white/40 py-16">
              No active listings yet. Add women from the admin panel and they will appear here.
            </p>
          ) : (
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
              {profiles.map((profile) => (
                <SwiperSlide key={profile.id} className="max-w-[350px]">
                  <ProfileCard profile={profile} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      <section className="py-24 glass-dark border-y border-white/5">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
          {[
            {
              icon: ShieldCheck,
              title: 'Total Discretion',
              desc: 'Private browsing and encrypted messaging options for your privacy.',
            },
            {
              icon: Zap,
              title: 'Real Listings',
              desc: 'Profiles are managed by admins — rates, services, and availability stay current.',
            },
            {
              icon: Star,
              title: 'Clear Services',
              desc: 'Each companion lists the services she offers so clients know what to expect.',
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
    </div>
  );
};

export default Home;
