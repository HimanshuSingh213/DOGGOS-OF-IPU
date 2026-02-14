"use client";
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

export default function SearchableGallery({ initialDogs }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const filteredDogs = useMemo(() => {
    return initialDogs.filter(dog => 
      dog.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dog.breed?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [initialDogs, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  
  const viewLimit = isMobile ? 3 : 6; 
  const showViewMore = !isSearching && filteredDogs.length > viewLimit;
  
 
  const containerStyle = {
    maxHeight: (isExpanded || isSearching || !showViewMore) ? '10000px' : (isMobile ? '2200px' : '950px'),

    transition: isMounted ? 'max-height 1.2s cubic-bezier(0.645, 0.045, 0.355, 1)' : 'none'
  };

  return (
    <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
    
      <div className="flex justify-center mb-20 px-2"> 
        <div className="w-full max-w-2xl flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200 transition-all focus-within:ring-2 focus-within:ring-[#4FB6B2]/20 focus-within:border-[#4FB6B2]">
          
         
          <div className="pl-3 flex items-center justify-center pointer-events-none">
             <svg 
               xmlns="http://www.w3.org/2000/svg" 
               fill="none" 
               viewBox="0 0 24 24" 
               strokeWidth={2} 
               stroke="#9CA3AF" 
               className="w-5 h-5"
               aria-hidden="true"
             >
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
             </svg>
          </div>

          <input 
            type="text" 
            placeholder="Search by name or breed..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 text-sm md:text-base outline-none bg-transparent font-medium text-[#2E2E2E] placeholder-gray-400"
          />

        
          <button 
            className="hidden md:flex items-center justify-center bg-[#4FB6B2] hover:bg-[#3d928f] text-white p-2.5 rounded-full transition-colors shadow-sm"
            type="button"
            aria-label="Search"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2.5} 
              stroke="currentColor" 
              className="w-4 h-4"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-[#C89B6A] uppercase tracking-tighter">
            Hearts in Waiting
        </h2>
        <p className="text-sm md:text-base font-bold text-[#4FB6B2] mt-2 uppercase tracking-[0.2em] opacity-80">
            Meet the wonderful companions looking for their perfect match today.
        </p>
      </div>

      <div className="relative overflow-hidden" style={containerStyle}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-24 pb-28 w-full will-change-transform">
                {filteredDogs.map((dog, index) => {
  const isBeyondLimit = index >= viewLimit;
  const shouldHide = showViewMore && !isExpanded && isBeyondLimit;

  return (
    <div 
      key={dog.id} 
      
     
      style={{ display: shouldHide ? 'none' : 'flex' }}
      className={`bg-white rounded-[40px] p-8 shadow-2xl flex flex-col items-center border border-gray-100 hover:scale-105 transition-all duration-700 h-full
        ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
    >
   
                <div className="w-56 h-56 flex-shrink-0 rounded-full overflow-hidden mb-10 border-[6px]" style={{ borderColor: '#FFF4E8' }}>
                  <img 
                    src={dog.photos?.[0] || '/simba.png'} 
                    className="w-full h-full object-cover" 
                    alt={dog.name} 
                  />
                </div>

              
                <div className="flex-grow flex flex-col items-center w-full">
                  <h2 className="text-4xl font-black mb-4 uppercase tracking-tight text-[#2E2E2E] text-center leading-tight">
                    {dog.name}
                  </h2>
                  <p className="text-lg font-black mb-10 tracking-widest text-[#C89B6A] uppercase text-center">
                    {dog.breed || 'INDIE'}
                  </p>
                </div>
                
               
                <div className="w-full mt-auto">
                  <div className="flex justify-center gap-4 mb-14">
                    <span className="px-6 py-2 rounded-full text-xs font-black uppercase text-white shadow-sm whitespace-nowrap" style={{ backgroundColor: '#6BCF9B' }}>
                      {dog.vaccinated ? 'VACCINATED' : 'NOT VACCINATED'}
                    </span>
                    <span className="px-6 py-2 rounded-full text-xs font-black uppercase shadow-sm" 
                          style={{ 
                            backgroundColor: dog.gender?.toLowerCase() === 'female' ? '#FFE1D6' : '#CFEAF5', 
                            color: '#2E2E2E' 
                          }}>
                      {dog.gender}
                    </span>
                  </div>

                  <Link href={`/adoption/${dog.id}`} className="w-full">
                    <button className="w-full py-5 rounded-2xl text-xl font-black text-white uppercase tracking-widest shadow-lg"
                            style={{ backgroundColor: '#4FB6B2' }}>
                      Adopt Me
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {showViewMore && !isExpanded && (
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-gray-50/80 via-white/40 to-transparent pointer-events-none z-10" />
        )}
      </div>

      {showViewMore && (
        <div className="flex justify-center mt-12 pb-20">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-12 py-4 rounded-2xl text-xl font-black text-white uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all"
            style={{ backgroundColor: '#4FB6B2' }}
          >
            {isExpanded ? 'View Less' : 'View More'}
          </button>
        </div>
      )}
    </div>
  );
}