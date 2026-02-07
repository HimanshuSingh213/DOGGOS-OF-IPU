"use client";
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  
  return (
    <button 
      onClick={() => router.back()} 
      className="w-12 h-12 rounded-full border-[3px] flex items-center justify-center text-xl font-bold transition-colors hover:bg-gray-100"
      style={{ borderColor: '#2E2E2E', color: '#2E2E2E' }}
    >
      ←
    </button>
  );
}