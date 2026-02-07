"use client";
import React, { useEffect, useRef, useState } from 'react'
import { PawPrint, ArrowRight, Heart, Bone } from "lucide-react";
import ContactSection from '@/components/ContactSection';
import Navbar from '@/components/Navbar';
import EventCardSkeleton from '@/components/events/EventCardSkeleton';
import gsap from "gsap";
import EventDetail from '@/components/events/EventDetail';
import EventCard from '@/components/events/EventCard';
import HowItWorksSection from '@/components/events/HowItWorksSection';
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();

function page() {

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showCount, setShowCount] = useState(6);
  const jumpRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);


  useEffect(() => {
    if (!loading) {
      const newCards = document.querySelectorAll(".event-card:not(.animated)");

      if (newCards.length > 0) {
        gsap.fromTo(
          newCards,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.08,
            clearProps: 'transform',
            onComplete: () => {
              newCards.forEach(el => el.classList.add("animated"));
            }
          }
        );
      }
    }
  }, [loading, showCount]);

  useEffect(() => {
    if (!loading) {
      gsap.from(".state-box", {
        opacity: 0,
        scale: 0.98,
        duration: 0.6,
        ease: "power1.out",
      });
    }
  }, [loading, error, events.length]);


  useEffect(() => {
    gsap.to(jumpRef.current, {
      y: -10,
      duration: 1.1,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true
    });
  }, []);


  const handleEvent = async () => {
    try {
      setLoading(true);
      setError(false);

      const { data, error: supabaseError } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (supabaseError) throw supabaseError;

      setEvents(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleEvent();
  }, []);

  useEffect(() => {
    gsap.to(".float-icon", {
      y: -8,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 1.2,
    });
  }, []);


  useEffect(() => {
    if (!loading) {
      const newCards = document.querySelectorAll(".event-card:not(.animated)");

      if (newCards.length > 0) {
        gsap.fromTo(
          newCards,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.08,
            onComplete: () => {
              newCards.forEach(el => el.classList.add("animated"));
            }
          }
        );
      }
    }
  }, [loading, showCount]);


  const scrollToEvents = () => {
    const upcomingEvents = document.getElementById("upcoming");
    if (upcomingEvents) {
      upcomingEvents.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const scrollToSteps = () => {
    const HowItWorks = document.getElementById("HowItWorks");
    if (HowItWorks) {
      HowItWorks.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div>
      {/* NavBar */}
      <Navbar />

      {/* backgroung Wrapper */}
      <div className='bg-(--earthy-cream) px-5'>
        {/* Hero Section */}
        <div className='relative py-20 md:py-40 max-w-6xl mx-auto my-0 flex md:flex-row flex-col-reverse lg:gap-20 gap-12'>
          {/* Left Section */}
          <div className="left w-full md:w-1/2 space-y-5">

            {/* Tag */}
            <div className='flex items-center justify-center md:justify-start'>

              <div className='flex flex-row gap-1 font-inter text-[10px] text-(--primary-teal) justify-center items-center font-bold rounded-xl bg-(--primary-sky) w-fit py-1 px-2'>
                <PawPrint className='size-[10px]' />
                Student-Led Campus Dog NGO
              </div>
            </div>

            {/* Title */}
            <header className='text-4xl md:text-6xl font-bold text-center md:text-left'>Events & <br /> <span className='text-(--primary-teal)'>Medical Care</span></header>

            {/* Sub-title */}
            <h2 className='text-(--text-gray) font-medium text-sm text-center md:text-left md:text-lg font-inter mb-9'>From vaccination drives to emergency checkups, find out how you can help our campus dogs stay healthy and happy.</h2>

            {/* Redirect Button */}
            <div className='flex justify-start items-center lg:gap-4 gap-2'>

              {/* Find Events Button */}
              <button
                onClick={scrollToEvents}
                className='group px-6 py-3 flex items-center justify-center gap-1 text-[17px] text-(--base-white) bg-(--primary-teal) rounded-3xl font-semibold font-inter cursor-pointer hover:scale-104 transition duration-400 ease-out'>
                Find Events
                <ArrowRight className='text-[17px] group-hover:translate-x-1 transition duration-300 ease-out' />
              </button>

              {/* How it Works Button */}
              <button
                onClick={scrollToSteps}
                className='px-6 py-3 flex items-center justify-center gap-1 text-[17px] border-2 border-(--border-light) bg-white rounded-3xl font-semibold font-inter cursor-pointer hover:scale-104 transition duration-400 ease-out'>
                How it works
              </button>
            </div>

          </div>

          {/* Right Section */}
          <div className="right relative w-full md:w-1/2 flex items-center justify-center">
            {/* Soft glow behind dog */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="md:w-[380px] md:h-[380px] lg:w-[520px] lg:h-[520px] rounded-full bg-(--accent-coral)/20 blur-3xl"></div>
            </div>

            <div ref={jumpRef} className='rounded-full border-10 border-white shadow-2xl overflow-hidden size-64 lg:size-[420px] our-hero z-10'>
              <img src="https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&q=80&w=800" alt="Our Hero"
                className='h-full w-full object-cover '
              />

            </div>

            {/* Rotating Border */}
            <div className='absolute top-1/2 left-1/2 rounded-full -translate-1/2 border-3 border-dashed border-(--accent-coral) size-67 lg:size-[440px] animate-[spin_18s_linear_infinite]'></div>

            {/* Context icons around dog (desktop only) */}
            <PawPrint className="hidden md:block absolute top-[15%] right-[28%] size-4 text-(--primary-teal)/50" />
            <Heart className="hidden md:block absolute bottom-[22%] right-[30%] size-4 text-pink-400/50" />



          </div>

          {/* Paw background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">

            {/* Left spread */}
            <PawPrint className="hidden sm:block absolute top-20 left-10 size-16 text-(--primary-teal)/10 rotate-12" />
            <PawPrint className="absolute top-72 left-44 size-14 text-(--primary-teal)/10 -rotate-6" />
            <PawPrint className="absolute bottom-40 left-28 size-20 text-(--primary-teal)/10 rotate-6" />

            {/* Right spread */}
            <PawPrint className="absolute top-24 right-16 size-14 text-(--primary-teal)/8 rotate-6" />
            <PawPrint className="absolute top-1/2 right-40 size-18 text-(--primary-teal)/8 -rotate-12" />
            <PawPrint className="hidden sm:block absolute bottom-32 right-24 size-16 text-(--primary-teal)/8 rotate-3" />

          </div>


          {/* Floating Icons */}
          <PawPrint className="float-icon hidden sm:block absolute left-12 top-1/3 size-6 text-(--primary-teal)/60 pointer-events-none select-none" />

          <Heart className="float-icon hidden md:block absolute right-20 top-1/3 size-5 text-pink-400/60 pointer-events-none select-none" />

          <Bone className="float-icon hidden lg:block absolute right-40 bottom-32 size-5 text-yellow-500/60 pointer-events-none select-none" />



        </div>

      </div>

      {/* Upcoming Events */}
      <div id='upcoming' className='bg-white py-24'>
        {/* Max-width wrapper */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10'>
          {/* Heading */}
          <div className='w-full flex items-center justify-center'>
            <div className='relative'>
              <header className='w-full text-3xl md:text-5xl font-bold py-4 text-center md:text-left'>Upcoming Events</header>

              {/* Underline */}
              <div className='h-1 w-1/4 flex items-center justify-center absolute bottom-0 left-1/2 -translate-x-1/2 rounded-xl bg-(--secondary-yellow)'></div>
            </div>
          </div>

          {/* Events List */}
          <div className='flex flex-col items-center justify-center md:max-w-6xl md:mx-auto mx-5'>

            {/* Event List */}
            {/* Skeletons */}
            {loading && (
              <div className="grid md:grid-cols-3 grid-cols-1 gap-10 mb-10">
                <EventCardSkeleton />
                <EventCardSkeleton />
                <EventCardSkeleton />
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="state-box flex flex-col items-center justify-center text-center py-20 px-6 border-2 border-dashed border-red-200 bg-red-50/40 rounded-2xl w-full">

                <div className="md:text-5xl text-3xl mb-4">⚠️</div>

                <h3 className="md:text-2xl text-xl font-bold text-red-500">
                  Something went wrong
                </h3>

                <p className="mt-2 text-gray-600 max-w-md md:text-base text-sm">
                  We couldn’t load events right now.
                  Please try again in a few moments.
                </p>

                <button
                  onClick={handleEvent}
                  className="mt-6 px-6 py-2 rounded-3xl bg-[#042839] text-white hover:bg-[#05385B] transition"
                >
                  Retry
                </button>

              </div>
            )}



            {/* Empty State */}
            {!loading && !error && events.length === 0 && (
              <div className="state-box flex flex-col items-center justify-center text-center py-20 px-6 border-2 border-dashed border-teal-200 bg-teal-50/40 rounded-2xl w-full">

                <div className="md:text-5xl text-3xl mb-4">📭</div>

                <h3 className="md:text-2xl text-xl font-bold text-[#05385B]">
                  No Upcoming Events
                </h3>

                <p className="mt-2 text-gray-600 max-w-md md:text-base text-sm">
                  We don’t have any events scheduled right now.
                  Please check back soon or follow us for updates.
                </p>

              </div>
            )}


            {/* Event Cards */}
            {!loading && events.length > 0 && (
              <>
                <div className="grid md:grid-cols-3 grid-cols-1 gap-10 mb-10">
                  {events.slice(0, showCount).map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onCTAClick={(item) => setSelectedEvent(item)}
                    />
                  ))}
                </div>

                {events.length > showCount && (
                  <button
                    onClick={() => setShowCount(showCount + 6)}
                    className="px-8 py-3 rounded-3xl bg-[#042839] text-(--base-white) font-semibold"
                  >
                    Show More
                  </button>
                )}
              </>
            )}


          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}


      {/* How it Works */}
      <HowItWorksSection />

      {/* Footer */}
      <ContactSection />
    </div>
  )
}

export default page