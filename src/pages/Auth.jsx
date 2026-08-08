import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  User,
  Phone,
  MessageCircle,
  Banknote,
  FileText,
} from 'lucide-react';
import Button from '../components/common/Button';
import {
  CITY,
  REGISTRATION_FEE_GEL,
  whatsappRegistrationUrl,
} from '../config/site';

const Auth = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [rate, setRate] = useState('');
  const [services, setServices] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');

  const openWhatsAppRegistration = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('ჩაწერეთ სახელი.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 9) {
      setError('ჩაწერეთ სწორი ტელეფონი.');
      return;
    }
    if (!services.trim()) {
      setError('ჩაწერეთ სერვისები.');
      return;
    }
    window.open(
      whatsappRegistrationUrl({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        age: age.trim(),
        services: services.trim(),
        bio: bio.trim(),
        rate: rate.trim(),
      }),
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-6 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-3">რეგისტრაცია</h1>
          <p className="text-white/40 text-sm leading-relaxed">შეავსეთ ყველა ინფორმაცია და გააგრძელეთ WhatsApp-ზე. გადახდის მერე პროფილი გამოჩნდება.</p>
        </div>

        <div className="glass-dark p-8 rounded-3xl border-white/5">
          <div className="mb-6 rounded-2xl border border-luxury-gold/30 bg-luxury-gold/10 px-4 py-4">
            <div className="flex items-start gap-3">
              <Banknote className="text-luxury-gold shrink-0 mt-0.5" size={22} />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-luxury-gold mb-1">
                  რეგისტრაციის საფასური
                </p>
                <p className="text-2xl font-semibold text-white">{REGISTRATION_FEE_GEL}₾</p>
                <p className="text-sm text-white/55 mt-2 leading-relaxed">WhatsApp-ზე გეტყვით ზუსტად სად გადაიხადო.</p>
              </div>
            </div>
          </div>

          <form className="space-y-4" onSubmit={openWhatsAppRegistration}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase tracking-widest px-1">სახელი</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:border-luxury-gold/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase tracking-widest px-1">ტელეფონი (WhatsApp)</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+995 5XX XX XX XX"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:border-luxury-gold/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-widest px-1">ასაკი</label>
                <input
                  type="number"
                  min={18}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 focus:outline-none focus:border-luxury-gold/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-widest px-1">ქალაქი</label>
                <input
                  type="text"
                  value={CITY}
                  readOnly
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white/70 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase tracking-widest px-1">ელფოსტა (არასავალდებულო)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:border-luxury-gold/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase tracking-widest px-1">საათობრივი ტარიფი (₾/სთ)</label>
              <input
                type="number"
                min={0}
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="150"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 focus:outline-none focus:border-luxury-gold/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase tracking-widest px-1">სერვისები</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 text-white/20" size={18} />
                <textarea
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  required
                  rows={3}
                  placeholder="..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-luxury-gold/50 resize-y"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase tracking-widest px-1">შესახებ საკუთარი</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 focus:outline-none focus:border-luxury-gold/50 resize-y"
              />
            </div>

            {error ? (
              <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full py-4 text-lg flex items-center justify-center gap-2">
              <MessageCircle size={20} />
              გაგრძელება WhatsApp-ზე
            </Button>

            <p className="text-center text-[11px] text-white/35 leading-relaxed">
              კლიენტები დაგირეგისტრირების გარეშე აირჩევენ ქალს და ურედ ტელეფონზე. {REGISTRATION_FEE_GEL}₾.
            </p>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <Link to="/explore" className="text-sm text-luxury-gold hover:underline">
              პროფილების ნახვა
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
