'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

export const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-yo-orange rounded-full shadow-yo-xl flex items-center justify-center text-white hover:bg-yo-orange-dark transition"
          >
            <MessageCircle className="w-8 h-8" />
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-yo-green rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
              1
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-40 w-96 h-[500px] bg-white rounded-yo-xl shadow-yo-xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-yo-green to-yo-green-light p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  💬
                </div>
                <div>
                  <h3 className="font-bold">Support Yo! Voiz</h3>
                  <p className="text-xs text-white/80">En ligne • Répond en ~2min</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-yo-gray-50 space-y-3">
              {/* Bot message */}
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-yo-green rounded-full flex items-center justify-center text-white flex-shrink-0">
                  🤖
                </div>
                <div className="bg-white rounded-yo-md p-3 shadow-yo-sm max-w-[80%]">
                  <p className="text-sm">
                    Salut ! 👋 Je suis ton assistant Yo! Voiz. Comment puis-je t'aider aujourd'hui ?
                  </p>
                </div>
              </div>

              {/* Quick replies */}
              <div className="flex flex-wrap gap-2 pl-10">
                {[
                  'Comment ça marche ?',
                  'Créer un compte',
                  'Trouver un prestataire',
                  'Devenir prestataire',
                ].map((text, i) => (
                  <button
                    key={i}
                    className="px-3 py-1.5 bg-white hover:bg-yo-green hover:text-white border border-yo-gray-200 rounded-full text-xs font-medium transition"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-yo-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Écris ton message..."
                  className="flex-1 px-4 py-2 border-2 border-yo-gray-200 rounded-full focus:outline-none focus:border-yo-green text-sm"
                />
                <button className="w-10 h-10 bg-yo-orange text-white rounded-full flex items-center justify-center hover:bg-yo-orange-dark transition">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
