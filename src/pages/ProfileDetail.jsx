import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft, Star, MapPin, Heart,
  MessageSquare, Phone, Share2,
} from 'lucide-react';
import Button from '../components/common/Button';
import ProfileCard from '../components/common/ProfileCard';
import { fetchPublicProfile } from '../api/publicApi';
import { mapProfile } from '../utils/mapProfile';
import { useProfiles } from '../hooks/useProfiles';
import { telHref, whatsappToProfile } from '../config/site';
import { isFavorite, toggleFavorite } from '../utils/favorites';

const ProfileDetail = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fav, setFav] = useState(false);
  const { profiles: similar } = useProfiles({ city: 'Batumi', take: 8 });

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      if (cancelled) return;
      setLoading(true);
      setError('');
      fetchPublicProfile(id)
        .then((data) => {
          if (cancelled) return;
          const mapped = mapProfile(data);
          setProfile(mapped);
          setFav(isFavorite(mapped?.id));
        })
        .catch((err) => {
          if (!cancelled) {
            setProfile(null);
            setError(err?.response?.data?.error || err?.message || 'პროფილი ვერ მოიძებნა');
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [id]);

  if (loading) {
    return <div className="pt-28 pb-12 text-center text-white/40">პროფილი იტვირთება…</div>;
  }

  if (!profile) {
    return (
      <div className="pt-28 pb-12 text-center">
        <p className="text-white/60 mb-4">{error || 'პროფილი ვერ მოიძებნა'}</p>
        <Link to="/explore" className="text-luxury-gold hover:underline">უკან ძებნაზე</Link>
      </div>
    );
  }

  const serviceLines = (profile.servicesText || '')
    .split(/[\n,•·|]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const similarProfiles = similar
    .filter((p) => p.id !== profile.id && p.slug !== profile.slug)
    .slice(0, 3);

  return (
    <div className="pt-20 pb-12">
      <div className="container mx-auto px-6">
        <Link to="/explore" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors">
          <ChevronLeft size={20} /> უკან ძებნაზე
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 gap-4 mb-8">
              {profile.images.map((img, i) => (
                <motion.div
                  key={`${img}-${i}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative overflow-hidden rounded-3xl ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={profile.name} />
                </motion.div>
              ))}
            </div>

            <div className="glass-dark p-8 rounded-3xl border-white/5 mb-8">
              <h2 className="text-2xl mb-4">შესახებ — <span className="text-luxury-gold">{profile.name}</span></h2>
              <p className="text-white/60 leading-relaxed text-lg mb-8 whitespace-pre-wrap">
                {profile.about || 'ბიოგრაფია ჯერ არ არის დამატებული.'}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { label: 'ქალაქი', value: profile.location },
                  { label: 'ასაკი', value: profile.age ? String(profile.age) : '—' },
                  { label: 'სტატუსი', value: profile.is_online ? 'ხელმისაწვდომი' : 'ოფლაინ' },
                ].map((info) => (
                  <div key={info.label}>
                    <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">{info.label}</div>
                    <div className="text-white font-medium">{info.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-dark p-8 rounded-3xl border-white/5 mb-8">
              <h2 className="text-2xl mb-4">შეთავაზებული <span className="text-luxury-gold">სერვისები</span></h2>
              {serviceLines.length ? (
                <ul className="grid sm:grid-cols-2 gap-3">
                  {serviceLines.map((line) => (
                    <li
                      key={line}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80 text-sm"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/40">სერვისები გამოჩნდება მას შემდეგ, რაც პროვაიდერი დაამატებს.</p>
              )}
            </div>

            {similarProfiles.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl mb-8">მსგავსი <span className="text-luxury-gold">თანმხლებები</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {similarProfiles.map((p) => (
                    <ProfileCard key={p.id} profile={p} />
                  ))}
                </div>
              </div>
            )}
          </div>

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
                    <span className="text-[10px] text-white/40">{profile.reviews_count} შეფასება</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {profile.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-bold text-luxury-gold/80 border border-luxury-gold/20 px-3 py-1 rounded-full uppercase tracking-tighter">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-white/60">ტარიფი</span>
                    <span className="text-xl font-bold text-luxury-gold">{profile.price}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-white/60">სტატუსი</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${profile.is_online ? 'bg-green-500 animate-pulse' : 'bg-white/30'}`} />
                      <span className={`font-bold text-xs uppercase ${profile.is_online ? 'text-green-400' : 'text-white/40'}`}>
                        {profile.is_online ? 'ხელმისაწვდომი' : 'ოფლაინ'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {telHref(profile.phone) ? (
                    <a href={telHref(profile.phone)} className="w-full">
                      <Button className="w-full py-4 text-lg flex items-center justify-center gap-2">
                        <Phone size={20} /> დარეკვა
                      </Button>
                    </a>
                  ) : (
                    <Button disabled className="w-full py-4 text-lg opacity-50 cursor-not-allowed">
                      ტელეფონი მიუწვდომელია
                    </Button>
                  )}
                  {whatsappToProfile(profile.phone, { profileName: profile.name }) ? (
                    <a
                      href={whatsappToProfile(profile.phone, { profileName: profile.name })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full py-4 flex items-center justify-center gap-2">
                        <MessageSquare size={20} /> WhatsApp
                      </Button>
                    </a>
                  ) : null}
                </div>

                <div className="mt-8 flex items-center justify-center gap-8 border-t border-white/5 pt-8">
                  <button
                    type="button"
                    onClick={() => setFav(toggleFavorite(profile))}
                    className={`flex flex-col items-center gap-2 transition-colors ${
                      fav ? 'text-red-400' : 'text-white/40 hover:text-luxury-gold'
                    }`}
                  >
                    <Heart size={20} fill={fav ? 'currentColor' : 'none'} />
                    <span className="text-[10px] uppercase">რჩეული</span>
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const url = `${window.location.origin}/profile/${profile.slug || profile.id}`;
                      try {
                        if (navigator.share) {
                          await navigator.share({ title: profile.name, url });
                        } else {
                          await navigator.clipboard.writeText(url);
                        }
                      } catch {
                        /* user cancelled share */
                      }
                    }}
                    className="flex flex-col items-center gap-2 text-white/40 hover:text-luxury-gold transition-colors"
                  >
                    <Share2 size={20} />
                    <span className="text-[10px] uppercase">გაზიარება</span>
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
