import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { WHATSAPP_NUMBER, whatsappContactUrl } from '../config/site';

const Messaging = () => {
  return (
    <div className="pt-28 pb-12 px-6">
      <div className="container mx-auto max-w-xl">
        <div className="glass-dark rounded-[40px] border-white/5 p-10 md:p-14 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle size={36} className="text-luxury-gold" />
          </div>
          <h1 className="text-3xl md:text-4xl mb-4">
            კონტაქტი <span className="text-luxury-gold">WhatsApp</span>-ით
          </h1>
          <p className="text-white/45 mb-8 leading-relaxed">
            ჩატი საიტზე ჯერ არ არის ჩართული. ჯავშანი და შეტყობინება იხსნება WhatsApp-ზე — პროფილის გვერდიდან ან ქვემოთ მოცემული ღილაკით.
          </p>
          <a
            href={whatsappContactUrl({ intent: 'message' })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full sm:w-auto"
          >
            <Button className="w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-2">
              <MessageCircle size={20} />
              WhatsApp ({WHATSAPP_NUMBER})
            </Button>
          </a>
          <div className="mt-6">
            <Link to="/explore" className="text-sm text-luxury-gold hover:underline">
              უკან ძებნაზე
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;
