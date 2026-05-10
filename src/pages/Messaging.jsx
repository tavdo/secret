import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, MoreVertical, Send, Image as ImageIcon,
  Smile, Mic, Phone, Video, ChevronLeft, MessageSquare
} from 'lucide-react';
import { MOCK_CHATS } from '../data/mockData';
import Button from '../components/common/Button';

const Messaging = () => {
  const [selectedChat, setSelectedChat] = useState(MOCK_CHATS[0]);
  const [message, setMessage] = useState('');
  const [showMobileList, setShowMobileList] = useState(true);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setShowMobileList(false);
  };

  return (
    <div className="pt-20 h-screen overflow-hidden flex flex-col">
      <div className="container mx-auto px-6 flex-grow flex gap-6 pb-24 md:pb-6">
        {/* Chat List */}
        <div className={`w-full md:w-80 lg:w-96 glass-dark rounded-3xl border-white/5 flex flex-col ${!showMobileList ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6">
            <h1 className="text-2xl mb-6">Messages</h1>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input 
                type="text" 
                placeholder="Search chats..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-luxury-gold/50"
              />
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto px-2 no-scrollbar">
            {MOCK_CHATS.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all mb-2 ${
                  selectedChat?.id === chat.id ? 'bg-luxury-gold/10 border-luxury-gold/20 border' : 'hover:bg-white/5'
                }`}
              >
                <div className="relative">
                  <img src={chat.avatar} className="w-14 h-14 rounded-full object-cover" alt={chat.name} />
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-luxury-dark rounded-full" />
                  )}
                </div>
                <div className="flex-grow text-left overflow-hidden">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-white">{chat.name}</span>
                    <span className="text-[10px] text-white/30">{chat.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-white/50 truncate pr-4">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <span className="bg-luxury-gold text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`flex-grow glass-dark rounded-3xl border-white/5 flex flex-col relative ${showMobileList ? 'hidden md:flex' : 'flex'}`}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setShowMobileList(true)}
                    className="md:hidden p-2 text-white/40"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <div className="relative">
                    <img src={selectedChat.avatar} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" alt={selectedChat.name} />
                    {selectedChat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-luxury-dark rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{selectedChat.name}</h3>
                    <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest">Active Now</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  <button className="p-2 text-white/40 hover:text-white transition-colors">
                    <Phone size={20} />
                  </button>
                  <button className="p-2 text-white/40 hover:text-white transition-colors">
                    <Video size={20} />
                  </button>
                  <button className="p-2 text-white/40 hover:text-white transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar">
                <div className="flex justify-center">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold bg-white/5 px-4 py-1 rounded-full">Today</span>
                </div>

                <div className="flex flex-col gap-4">
                  <Message bubble="Hi! I saw your profile and I'm very interested." time="10:00 AM" isOwn={false} />
                  <Message bubble="Hello! Thank you for reaching out. How can I help you?" time="10:05 AM" isOwn={true} />
                  <Message bubble="I would like to book a session for tomorrow evening." time="10:10 AM" isOwn={false} />
                  <Message bubble="Of course. I have availability after 8 PM. Does that work for you?" time="10:12 AM" isOwn={true} />
                  <div className="flex items-center gap-2 text-white/20 animate-pulse mt-4">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{selectedChat.name} is typing...</span>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 md:p-6 bg-black/20 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-white/40 hover:text-white transition-colors">
                      <ImageIcon size={20} />
                    </button>
                    <button className="p-2 text-white/40 hover:text-white transition-colors">
                      <Mic size={20} />
                    </button>
                  </div>
                  <div className="flex-grow relative">
                    <input 
                      type="text" 
                      placeholder="Type a premium message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pr-12 text-sm focus:outline-none focus:border-luxury-gold/50"
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-luxury-gold transition-colors">
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
              <h2 className="text-2xl font-bold mb-2">Private Encrypted Messaging</h2>
              <p className="text-white/40 max-w-sm">Select a companion to start a secure conversation. Your privacy is our priority.</p>
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
    <div className={`max-w-[80%] md:max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
      <div className={`p-4 rounded-2xl text-sm ${
        isOwn 
        ? 'bg-gold-gradient text-black font-medium rounded-tr-none' 
        : 'glass-dark border-white/10 text-white/90 rounded-tl-none'
      }`}>
        {bubble}
      </div>
      <span className="text-[10px] text-white/20 px-1">{time} {isOwn && '· Seen'}</span>
    </div>
  </motion.div>
);

export default Messaging;
