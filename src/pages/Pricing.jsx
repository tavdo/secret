import { motion } from 'framer-motion';
import { Check, Shield, Star, Crown, Zap, Info } from 'lucide-react';
import Button from '../components/common/Button';

const Pricing = () => {
  const tiers = [
    {
      name: 'Gold',
      price: '$299',
      duration: 'per month',
      description: 'The essential entry into the world of luxury companionship.',
      features: [
        'Access to Verified Profiles',
        'Secure Encrypted Messaging',
        'Basic Concierge Support',
        '3 VIP Profile Unlocks / Mo',
        'Standard Booking Priority'
      ],
      icon: Star,
      isPopular: false,
    },
    {
      name: 'Platinum',
      price: '$799',
      duration: 'per month',
      description: 'Our most popular choice for regular city travelers.',
      features: [
        'Access to All VIP Profiles',
        'Unlimited Encrypted Messaging',
        '24/7 Dedicated Concierge',
        'Unlimited Profile Unlocks',
        'High Booking Priority',
        'Travel Planning Assistance',
        'Invite to Private Events'
      ],
      icon: Crown,
      isPopular: true,
      color: 'gold-gradient'
    },
    {
      name: 'Diamond',
      price: '$1,999',
      duration: 'per month',
      description: 'The ultimate level of service for the truly discerning.',
      features: [
        'Hidden Elite Profiles Only',
        'Personal Account Manager',
        'Private Jet & Villa Bookings',
        'Global Travel Escorts',
        'Immediate Booking Priority',
        'Anonymous Ghost Payments',
        'Bespoke Experience Planning',
        'Gift & Luxury Delivery'
      ],
      icon: Shield,
      isPopular: false,
    }
  ];

  return (
    <div className="pt-28 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-luxury-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
          >
            <Zap size={14} fill="currentColor" /> Membership Plans
          </motion.div>
          <h1 className="text-4xl md:text-6xl mb-6">Choose Your <span className="gold-text-gradient">Tier</span></h1>
          <p className="max-w-2xl mx-auto text-white/40 text-lg">
            Invest in a membership that matches your lifestyle. Each tier offers 
            different levels of access, discretion, and personalized service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col p-8 rounded-[32px] border transition-all duration-500 ${
                tier.isPopular 
                ? 'bg-white/5 border-luxury-gold shadow-[0_0_50px_rgba(212,175,55,0.1)] scale-105 z-10' 
                : 'bg-black/40 border-white/5 hover:border-white/20'
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold-gradient text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  Most Preferred
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tier.isPopular ? 'bg-gold-gradient text-black' : 'bg-white/5 text-luxury-gold'}`}>
                  <tier.icon size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{tier.name}</h3>
                  <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">Membership</div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-white/40 text-sm">{tier.duration}</span>
                </div>
                <p className="text-white/40 text-sm mt-4 leading-relaxed">{tier.description}</p>
              </div>

              <div className="flex-grow space-y-4 mb-10">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className={`mt-1 p-0.5 rounded-full ${tier.isPopular ? 'bg-luxury-gold/20 text-luxury-gold' : 'bg-white/10 text-white/40'}`}>
                      <Check size={12} />
                    </div>
                    <span className="text-sm text-white/60">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                variant={tier.isPopular ? 'primary' : 'outline'} 
                className="w-full py-4 text-base font-bold uppercase tracking-widest"
              >
                Select {tier.name}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* FAQ/Security Section */}
        <div className="mt-24 max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="flex gap-6">
            <div className="mt-1">
              <Shield className="text-luxury-gold" size={28} />
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2">Discreet Billing</h4>
              <p className="text-sm text-white/40 leading-relaxed">
                All transactions appear as "SV Media Group" on your statement to ensure 
                complete privacy for our members.
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="mt-1">
              <Info className="text-luxury-gold" size={28} />
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2">No Contracts</h4>
              <p className="text-sm text-white/40 leading-relaxed">
                You can upgrade, downgrade, or cancel your membership at any time 
                from your secure dashboard settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
