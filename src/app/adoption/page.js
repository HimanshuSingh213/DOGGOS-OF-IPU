import React from 'react';
import Link from 'next/link';
import ContactSection from "@/components/ContactSection"; 
import Navbar from "@/components/Navbar";
import { createClient } from '@/lib/supabase/server';
import SearchableGallery from '@/components/SearchableGallery';
import AdoptionBackground from "@/components/AdoptionBackground";

export const dynamic = 'force-dynamic'; 

export default async function AdoptionGallery() {
  const supabase = await createClient();
  
  const { data: dogData, error } = await supabase
    .from('adoptions')
    .select('*')
    .eq('status', 'available') 
    .order('created_at', { ascending: false });

  const { data: adoptedData, error: adoptedError } = await supabase
    .from('adoptions')
    .select('*')
    .eq('status', 'adopted') 
    .order('created_at', { ascending: false });

  if (error || adoptedError) {
    console.error("Error fetching dogs:", error || adoptedError);
  }

  return (
   <div className="flex flex-col min-h-screen overflow-x-hidden relative">
      <AdoptionBackground /> 
      <Navbar />
      
      <main className="grow pb-20 bg-transparent">
        <div className="w-full h-64 md:h-80 mb-12 relative overflow-hidden bg-[#E5E7EB]">
          <img src="/adoption-bg.png" className="w-full h-full object-cover" alt="Dogs of IPU Banner" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
               <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-2xl">
                  Find Your Paw-tner
              </h1>
          </div>
        </div>

        
        <SearchableGallery initialDogs={dogData || []} />
        {adoptedData && adoptedData.length > 0 && (
          <section className="mt-32 px-6 max-w-7xl mx-auto overflow-hidden">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-[#4FB6B2] uppercase tracking-tighter">The Hall of Hearts</h2>
              <p className="text-sm md:text-base font-medium text-[#C89B6A] mt-2 italic opacity-90">
                Our Forever Family Archive: Cherishing the stories of the dogs who found their perfect home.
              </p>
            </div>

            
            <div className="flex overflow-x-auto gap-8 pb-10 scrollbar-hide snap-x">
              {adoptedData.map((dog) => (
                <Link key={dog.id} href={`/adoption/${dog.id}`} className="flex-shrink-0 snap-center">
                  <div className="w-64 h-[420px] bg-white/80 backdrop-blur-sm rounded-[40px] p-6 shadow-xl border border-white/50 flex flex-col items-center hover:scale-105 transition-transform duration-500">
                    <div className="w-40 h-40 flex-shrink-0 rounded-full overflow-hidden mb-6 border-[5px]" style={{ borderColor: '#FFF4E8' }}>
                      <img 
                        src={dog.photos?.[0] || '/simba.png'} 
                        className="w-full h-full object-cover grayscale-[20%]" 
                        alt={dog.name} 
                      />
                    </div>
                    <h3 className="text-2xl font-black text-[#2E2E2E] uppercase tracking-tight text-center">{dog.name}</h3>
                    <p className="text-[10px] font-black text-[#C89B6A] tracking-[0.2em] uppercase mb-auto text-center">{dog.breed || 'INDIE'}</p>
                    <div className="mt-4 px-6 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-md" style={{ backgroundColor: '#4FB6B2' }}>
                      Adopted
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <ContactSection />
    </div>
  );
}
