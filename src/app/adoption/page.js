import React from 'react';
import Link from 'next/link';
import Footer from "@/components/_Footer"; 
import Navbar from "@/components/Navbar";
import { createClient } from '@/lib/supabase/server';
import SearchableGallery from '@/components/SearchableGallery';


export const dynamic = 'force-dynamic'; 

export default async function AdoptionGallery() {
  const supabase = await createClient();
  
  
  const { data: dogData, error } = await supabase
    .from('adoptions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching dogs:", error);
  }

  return (
    <div className="flex flex-col min-h-screen paw-texture overflow-x-hidden">
      <Navbar />
      
      <main className="grow pb-20 bg-transparent">
        
        <div className="w-full h-64 md:h-80 mb-12 relative overflow-hidden bg-[#E5E7EB]">
          <img 
            src="/adoption-bg.png" 
            className="w-full h-full object-cover" 
            alt="Dogs of IPU Banner" 
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
               <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-2xl">
                  Find Your Paw-tner
              </h1>
          </div>
        </div>

        
        <SearchableGallery initialDogs={dogData || []} />

      </main>

      <Footer />
    </div>
  );
}