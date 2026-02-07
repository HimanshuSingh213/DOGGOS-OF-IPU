"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SearchableGallery({ initialDogs }) {
  const [searchQuery, setSearchQuery] = useState("");
  
  
  const filteredDogs = initialDogs.filter(dog => 
    dog.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dog.breed?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
      
      
      <div className="flex justify-center mb-32"> 
        <div className="w-full max-w-4xl flex items-center rounded-3xl px-8 py-5 shadow-xl border-4 border-white" 
             style={{ backgroundColor: '#CFEAF5' }}>
          <span className="text-3xl mr-4">🔍</span>
          <input 
            type="text" 
            placeholder="Search by name or breed..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-2xl outline-none bg-transparent font-bold text-[#2E2E2E] placeholder-[#4FB6B2]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-24">
        {filteredDogs.map((dog) => (
          <div key={dog.id} className="bg-white/70 backdrop-blur-lg rounded-[40px] p-8 shadow-2xl flex flex-col items-center border border-white/40 hover:scale-105 transition-transform duration-300">
            <div className="w-56 h-56 rounded-full overflow-hidden mb-10 border-[6px]" style={{ borderColor: '#FFF4E8' }}>
              <img 
                src={dog.photos && dog.photos[0] ? dog.photos[0] : '/simba.png'} 
                className="w-full h-full object-cover" 
                alt={dog.name} 
              />
            </div>
            <h2 className="text-4xl font-black mb-4 uppercase tracking-tight" style={{ color: '#2E2E2E' }}>{dog.name}</h2>
            <p className="text-lg font-black mb-10 tracking-widest" style={{ color: '#C89B6A' }}>{dog.breed || 'INDIE'}</p>
            
            <div className="flex gap-4 mb-14">
              <span className="px-6 py-2 rounded-full text-xs font-black uppercase text-white shadow-sm" style={{ backgroundColor: '#6BCF9B' }}>
                {dog.vaccinated ? 'VACCINATED' : 'NOT VACCINATED'}
              </span>
              
              {/* Gender based coloring */}
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
        ))}
      </div>
    </div>
  );
}