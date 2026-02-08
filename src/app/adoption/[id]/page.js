import React from 'react';
import { createClient } from '@/lib/supabase/server';
import Footer from "@/components/_Footer"; 
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";

export default async function DogProfile({ params }) {
  
  const { id } = await params; 
  
  const supabase = await createClient();

  const { data: dog, error } = await supabase
    .from('adoptions')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !dog) {
    return (
      <div className="flex flex-col min-h-screen paw-texture" style={{ backgroundColor: '#F9FBFC' }}>
        <Navbar />
        <main className="grow flex flex-col items-center justify-center gap-6">
          <p className="text-3xl font-black uppercase text-[#2E2E2E]">Doggo not found!</p>
          <BackButton />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen paw-texture" style={{ backgroundColor: '#F9FBFC' }}>
      <Navbar />
      
      <main className="grow py-10 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white/80 backdrop-blur-md rounded-[50px] shadow-2xl overflow-hidden border border-white/50">
          
          
          <div className="h-52 w-full bg-[#E5E7EB] mb-4">
               <img 
                 src={dog.photos && dog.photos[0] ? dog.photos[0] : '/simba.png'} 
                 alt={dog.name} 
                 className="w-full h-full object-cover" 
               />
          </div>

          <div className="px-6 pb-12 flex flex-col items-center gap-y-2">
              
              <div className="-mt-12 mb-12 py-4 px-12 rounded-2xl shadow-xl text-3xl font-black text-white uppercase tracking-tighter"
                   style={{ backgroundColor: '#4FB6B2' }}>
                  {dog.name}
              </div>

              
              <div className="flex justify-center w-full gap-3 mb-12">
                  <StatBox label="AGE" value={dog.age || 'N/A'} color="#FFF4E8" />
                  <StatBox label="BREED" value={dog.breed || 'INDIE'} color="#FFF4E8" />
                  <StatBox label="GENDER" value={dog.gender} color={dog.gender?.toUpperCase() === 'FEMALE' ? '#FFE1D6' : '#CFEAF5'} />
              </div>

              
              <div className="w-full p-6 rounded-[25px] mb-12 text-white shadow-lg" style={{ backgroundColor: '#C89B6A' }}>
                  <h3 className="font-black text-lg mb-2 italic">About Me...</h3>
                  <p className="text-xs font-medium leading-relaxed opacity-95">
                    {dog.traits || 'Coco is a charming puppy. She is healthy, energetic, and looking for a loving home where she can grow.'}
                  </p>
              </div>

              
              <div className="w-full flex flex-col gap-6 mb-14">
                  <DetailRow label="VACCINATION" value={dog.vaccinated ? 'Yes' : 'No'} />
                  <DetailRow label="STERILIZED" value={dog.sterilized ? 'Yes' : 'No'} />
                  <DetailRow label="LOCATION" value={dog.location || 'IPU Campus'} />
              </div>

              
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSeUydyWVHgWnfoNjU6uGaUtrlrRNvCN8izgGhxsBeyJGv03dg/viewform" target="_blank" className="w-full">
                  <button className="w-full py-5 rounded-2xl text-xl font-black text-white uppercase tracking-widest shadow-xl"
                          style={{ backgroundColor: '#6BCF9B' }}>
                      Adopt Me
                  </button>
              </a>

              <div className="w-full flex justify-start mt-12">
                  <BackButton />
              </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


const StatBox = ({ label, value, color }) => (
    <div className="flex-1 py-4 rounded-xl text-center shadow-sm flex flex-col items-center justify-center" style={{ backgroundColor: color }}>
        <p className="text-[9px] font-black text-[#6B7280] uppercase mb-2">{label}</p>
        <p className="text-[11px] font-black text-[#2E2E2E] leading-tight">{value}</p>
    </div>
);

const DetailRow = ({ label, value }) => (
    <div className="flex items-center gap-4 mb-2">
        <span className="w-24 py-2 rounded-lg text-center font-black text-white uppercase text-[9px] shadow-sm" style={{ backgroundColor: '#4FB6B2' }}>{label}</span>
        <span className="flex-1 py-2 px-4 rounded-lg font-bold text-xs shadow-sm" style={{ backgroundColor: '#CFEAF5', color: '#2E2E2E' }}>{value}</span>
    </div>
);