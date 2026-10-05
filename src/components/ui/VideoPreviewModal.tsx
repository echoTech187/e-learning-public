import React, { useState, useEffect } from 'react';
import { FlatButton } from './FlatButton';

export interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  thumbnailUrl?: string;
  videoUrl?: string;
}

export const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  thumbnailUrl,
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Reset playing state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-black rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-white/10 z-10 flex flex-col transform transition-all">
        
        {/* Header (Overlaid) */}
        {!isPlaying && (
          <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-start justify-between z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/90 shadow-lg pointer-events-auto border-0 outline-none">
                <i className="fas fa-play text-xs ms-0.5"></i>
              </div>
              <div>
                <span className="text-white/70 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest block mb-0.5 drop-shadow-sm">Pratinjau Materi</span>
                <h3 className="font-bold text-white text-sm sm:text-base leading-tight line-clamp-1 drop-shadow-md">
                  {title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md text-white flex items-center justify-center transition-all hover:scale-105 pointer-events-auto border-0 outline-none"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* Video Player Area */}
        <div className="w-full aspect-video relative flex items-center justify-center bg-slate-950 group overflow-hidden">
          {!isPlaying ? (
            <>
              {/* Background Cover image */}
              {thumbnailUrl && (
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 transition duration-700 group-hover:opacity-30"
                  style={{ backgroundImage: `url(${thumbnailUrl})` }}
                ></div>
              )}
              
              {/* Play Button Center */}
              <div className="relative z-10 flex flex-col items-center">
                <div 
                  onClick={() => setIsPlaying(true)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/90 text-white flex items-center justify-center text-2xl sm:text-3xl shadow-[0_0_40px_rgba(99,102,241,0.6)] cursor-pointer hover:scale-110 hover:bg-primary transition-all duration-300 ring-4 ring-white/20"
                >
                  <i className="fas fa-play ms-1.5 sm:ms-2"></i>
                </div>
                <div className="mt-4 sm:mt-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <p className="text-white font-semibold tracking-wide text-sm sm:text-base drop-shadow-md">Putar Video Pratinjau</p>
                </div>
              </div>

              {/* Fake Video Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 group-hover:h-2 transition-all cursor-pointer">
                <div className="h-full bg-primary w-0 group-hover:w-1/3 transition-all duration-1000 ease-out relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </>
          ) : (
            <iframe 
              src={videoUrl} 
              className="w-full h-full border-0 absolute inset-0 z-10" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-900 p-4 sm:p-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 border-0 outline-none">
              <i className="fas fa-unlock-alt text-xs"></i>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-snug">
              Materi ini tersedia <strong className="text-white font-bold">gratis</strong> sebagai sampel pembelajaran.
            </p>
          </div>
          <FlatButton 
            onClick={onClose}
            variant="solid" 
            colorTheme="blue"
            size="sm"
            className="w-full sm:w-auto px-6 whitespace-nowrap shadow-none"
          >
            Tutup Pratinjau
          </FlatButton>
        </div>
        
      </div>
    </div>
  );
};
