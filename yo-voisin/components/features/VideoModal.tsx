'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';

interface VideoModalProps {
  videoId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ 
  videoId = 'dQw4w9WgXcQ', 
  isOpen, 
  onClose 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-4xl bg-yo-gray-800 rounded-yo-xl overflow-hidden shadow-yo-xl">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Video */}
              <div className="relative pt-[56.25%]">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface VideoTriggerProps {
  onClick: () => void;
}

export const VideoTrigger: React.FC<VideoTriggerProps> = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group relative w-full aspect-video rounded-yo-xl overflow-hidden shadow-yo-lg cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="absolute inset-0 bg-gradient-to-br from-yo-green-dark to-yo-green flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">📱</div>
          <h3 className="font-display font-bold text-2xl mb-2">
            Découvre Yo! Voiz en vidéo
          </h3>
          <p className="text-white/80">2 minutes pour tout comprendre</p>
        </div>
      </div>
      
      {/* Play button overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-yo-xl group-hover:scale-110 transition-transform">
          <Play className="w-10 h-10 text-yo-orange ml-1" fill="currentColor" />
        </div>
      </div>
    </motion.button>
  );
};
