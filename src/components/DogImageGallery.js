'use client';
import React, { useState, useEffect, useCallback } from 'react';

export default function DogImageGallery({ photos, dogName }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  const images = photos && photos.length > 0 ? photos : ['/simba.png'];
  const hasMultiple = images.length > 1;

  const handleNext = useCallback((e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback((e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard Navigation: Arrow Keys and A/D
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') handleNext();
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') handlePrev();
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, handleNext, handlePrev]);

  // Swipe Logic
  const onTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const onTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 50) handleNext();
    if (touchStart - touchEnd < -50) handlePrev();
    setTouchStart(null);
  };

  return (
    <>
      
      <div 
        className="h-64 w-full bg-[#E5E7EB] mb-4 relative cursor-pointer group overflow-hidden"
        onClick={() => setIsModalOpen(true)}
      >
        <img 
          src={images[currentIndex]} 
          alt={dogName} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
        
        {hasMultiple && (
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-tighter">
            {images.length} Photos
          </div>
        )}

        
        {hasMultiple && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'bg-white w-4' : 'bg-white/40 w-1.5'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-start justify-center pt-24 md:pt-32 p-4 bg-black/80 backdrop-blur-[2px] animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-2xl aspect-[4/3] md:aspect-video bg-black rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex items-center justify-center touch-pan-y"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            
            <button 
              className="absolute top-4 right-4 text-white/50 hover:text-white z-30 transition-all p-2"
              onClick={() => setIsModalOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            
            {hasMultiple && (
              <>
                <button 
                  onClick={handlePrev}
                  className="absolute left-4 text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full z-20 transition-all backdrop-blur-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button 
                  onClick={handleNext}
                  className="absolute right-4 text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full z-20 transition-all backdrop-blur-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </>
            )}

            {/* Main Image */}
            <img 
              src={images[currentIndex]} 
              className="max-w-full max-h-full object-contain select-none pointer-events-none"
              alt="Gallery"
            />

            {/* Status Indicator */}
            <div className="absolute bottom-4 px-4 py-1 bg-black/40 backdrop-blur-md rounded-full text-white/70 text-[10px] font-bold uppercase tracking-widest">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}