# -*- coding: utf-8 -*-
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]

# Rewrite Messaging cleanly
messaging = r'''import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, MoreVertical, Send, Image as ImageIcon,
  Smile, Mic, Phone, Video, ChevronLeft, MessageSquare,
} from 'lucide-react';
import { MOCK_CHATS } from '../data/mockData';
import Button from '../components/common/Button';

const Messaging = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [showMobileList, setShowMobileList] = useState(true);

  return (
    <div className="pt-20 h-screen overflow-hidden flex flex-col">
      <div className="container mx-auto px-6 flex-grow flex gap-6 pb-24 md:pb-6">
        <div className={`w-full md:w-80 lg:w-96 glass-dark rounded-3xl border-white/5 flex flex-col ${!showMobileList ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6">
            <h1 className="text-2xl mb-6">შეტყობინებები</h1>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="text"
                placeholder="ჩატების ძებნა..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-luxury-gold/50"
              />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto px-2 no-scrollbar">
            {MOCK_CHATS.length === 0 ? (
              <p className="px-4 py-8 text-sm text-white/40 text-center">საუ�">
            {MOCK_CHATS.length === 0 ? (
              <p className="px-4 py-8 text-sm text-white/40 text-center">საუბრები ჯერ არ არის.</p>
            ) : null}
            {MOCK_CHATS.map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => {
                  setSelectedChat(chat);
                  setShowMobileList(false);
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all mb-2 ${
                  selectedChat?.id === chat.id ? 'bg-luxury-gold/10 border-luxury-gold/20 border' : 'hover:bg-white/5'
                }`}
              >
                <img src={chat.avatar} className="w-14 h-14 rounded-full object-cover" alt={chat.name} />
                <div className="flex-grow text-left overflow-hidden">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-white">{chat.name}</span>
                    <span className="text-[10px] text-white/30">{chat.time}</span>
                  </div>
                  <p className="text-xs text-white/50 truncate">{chat.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={`flex-grow glass-dark rounded-3xl border-white/5 flex flex-col relative ${showMobileList ? 'hidden md:flex' : 'flex'}`}>
          {selectedChat ? (
            <>
              <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setShowMobileList(true)} className="md:hidden p-2 text-white/40">
                    <ChevronLeft size={24} />
                  </button>
                  <img src={selectedChat.avatar} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" alt={selectedChat.name} />
                  <div>
                    <h3 className="font-bold text-white">{selectedChat.name}</h3>
                    <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest">ახლა აქტიურია</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  <button type="button" className="p-2 text-white/40 hover:text-white"><Phone size={20} /></button>
                  <button type="button" className="p-2 text-white/40 hover:text-white"><Video size={20} /></button>
                  <button type="button" className="p-2 text-white/40 hover:text-white"><MoreVertical size={20} /></button>
                </div>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar">
                <div className="flex justify-center">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold bg-white/5 px-4 py-1 rounded-full">დღეს</span>
                </div>
                <div className="flex flex-col gap-4">
                  <Message bubble="გამარჯობა! ვნახე თქვენი პროფილი და დაინტერესებული ვარ." time="10:00" isOwn={false} />
                  <Message bubble="გამარჯობა! მადლობა მიმართვისთვის. როგორ შემიძლია დაგეხმაროთ?" time="10:05" isOwn={true} />
                  <Message bubble="მინდა ჯავშანი ხვალ საღამოს." time="10:10" isOwn={false} />
                  <Message bubble="რა თქმა უნდა. 20:00-ის შემდეგ თავისუფალი ვარ. გიხერხებთ?" time="10:12" isOwn={true} />
                </div>
              </div>

              <div className="p-4 md:p-6 bg-black/20 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button type="button" className="p-2 text-white/40 hover:text-white"><ImageIcon size={20} /></button>
                    <button type="button" className="p-2 text-white/40 hover:text-white"><Mic size={20} /></button>
                  </div>
                  <div className="flex-grow relative">
                    <input
                      type="text"
                      placeholder="დაწერეთ შეტყობინება..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pr-12 text-sm focus:outline-none focus:border-luxury-gold/50"
                    />
                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-luxury-gold">
                      <Smile size={20} />
                    </button>
                  </div>
                  <Button className="w-12 h-12 rounded-2xl p-0 flex items-center justify-center">
                    <Send size={20} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-12">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <MessageSquare size={40} className="text-white/20" />
              </div>
              <h2 className="text-2xl font-bold mb-2">პრივატული შეტყობინებები</h2>
              <p className="text-white/40 max-w-sm">
                აირჩიეთ თანმხლები უსაფრთხო საუბრის დასაწყებად. თქვენი კონფიდენციალურობა პრიორიტეტია.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Message = ({ bubble, time, isOwn }) => (
  <motion.div
    initial={{ opacity: 0, x: isOwn ? 20 : -20 }}
    animate={{ opacity: 1, x: 0 }}
    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
  >
    <div className={`max-w-[80%] md:max-w-[70%] flex flex-col gap-1 ${isOwn ? 'items-end' : 'items-start'}`}>
      <div
        className={`p-4 rounded-2xl text-sm ${
          isOwn
            ? 'bg-gold-gradient text-black font-medium rounded-tr-none'
            : 'glass-dark border-white/10 text-white/90 rounded-tl-none'
        }`}
      >
        {bubble}
      </div>
      <span className="text-[10px] text-white/20 px-1">
        {time} {isOwn ? '· ნანახია' : ''}
      </span>
    </div>
  </motion.div>
);

export default Messaging;
'''
(root / 'src/pages/Messaging.jsx').write_text(messaging, encoding='utf-8')

# Fix AdminLogin error message block
login_path = root / 'src/admin/pages/AdminLogin.jsx'
login = login_path.read_text(encoding='utf-8')
login = re.sub(
    r"err\?\.code === 'NOT_ADMIN'[\s\S]*?setError\(msg\);",
    """err?.code === 'NOT_ADMIN'
          ? 'ეს ანგარიში ადმინი არ არის.'
          : err?.response?.data?.error || err?.message || 'შესვლა ვერ მოხერხდა';
      setError(msg);""",
    login,
    count=1,
)
login = re.sub(
    r"<p className=\"text-xs text-zinc-500 leading-relaxed\">[\s\S]*?</p>\s*\) : null\}",
    """<p className="text-xs text-zinc-500 leading-relaxed">
              ქმნის პირველ ადმინს, თუ არცერთი არ არსებობს. გამოიყენეთ ერთხელ, შემდეგ შედით ჩვეულებრივად.
            </p>
          ) : null}""",
    login,
    count=1,
)
login_path.write_text(login, encoding='utf-8')

# Strip replacement chars from key files
for rel in [
    'src/pages/Home.jsx',
    'src/pages/Auth.jsx',
    'src/pages/Messaging.jsx',
    'src/admin/pages/AdminLogin.jsx',
    'src/admin/components/ProfileFormModal.jsx',
]:
    p = root / rel
    t = p.read_text(encoding='utf-8')
    if '\ufffd' in t:
        print('HAS REPLACEMENT:', rel)
    else:
        print('clean:', rel)
print('done')
