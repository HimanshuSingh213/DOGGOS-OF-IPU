"use client";

import { useEffect, useRef, useState , useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Navbar from "@/components/Navbar";
gsap.registerPlugin(ScrollTrigger);
import { IoPawSharp } from "react-icons/io5";
import { FaCameraRetro } from "react-icons/fa";
import { MdMedicalServices } from "react-icons/md";
import { GiDogHouse } from "react-icons/gi";
import { BsFillHouseHeartFill } from "react-icons/bs";

export default function MeetOurTeam() {
  const [mounted, setMounted] = useState(false);
  const stackRef = useRef([]);
  const containerRef = useRef(null);
  const gsapContextRef = useRef(null);
  const teamCursorRefs = useRef([]);
  const [page, setPage] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [pawFundingIndex, setPawFundingIndex] = useState(0); 
  const [isDesktop, setIsDesktop] = useState(false);
  const prevItemsPerPageRef = useRef(4);
  const [imageRemountKey, setImageRemountKey] = useState(0);
  const teamIconMap = {
  "Paw-Home Finder": <GiDogHouse />,
  "Paw-Funding": <BsFillHouseHeartFill />,
  "Paw-parazzi": <FaCameraRetro />,
  "Paw-medics": <MdMedicalServices />,
  "Paw-Connect": <IoPawSharp />,
  "Paw-ty Planners": <IoPawSharp />,
};



useEffect(() => {
  setMounted(true);
  

  const updateItemsPerPage = () => {
    const width = window.innerWidth;
    const wasDesktop = width >= 768; 
    setIsDesktop(wasDesktop);
    
    let newItemsPerPage;
    if (width < 640) {
      newItemsPerPage = 1;
    } else if (width < 1024) {
      newItemsPerPage = 2;
    } else {
      newItemsPerPage = 4;
    }

    const prevItems = prevItemsPerPageRef.current;
    if (prevItems < newItemsPerPage && prevItems <= 2 && newItemsPerPage >= 4) {

      setPage({});
      setImageRemountKey(prev => prev + 1);
    }
    
    prevItemsPerPageRef.current = newItemsPerPage;
    setItemsPerPage(newItemsPerPage);
  };
  
  updateItemsPerPage();
  window.addEventListener('resize', updateItemsPerPage);
  return () => window.removeEventListener('resize', updateItemsPerPage);
}, []);

useLayoutEffect(() => {
  if (!mounted) return;
  
  if (!isDesktop) {
    // If on mobile, kill any existing triggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    if (gsapContextRef.current) {
      gsapContextRef.current.revert();
      gsapContextRef.current = null;
    }
    return;
  }
  if (!containerRef.current) return;

  // Function to initialize ScrollTriggers
  const initScrollTriggers = () => {
    // Kill any existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // Revert previous context if exists
    if (gsapContextRef.current) {
      gsapContextRef.current.revert();
    }

    // Create new GSAP context
    gsapContextRef.current = gsap.context(() => {
      stackRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { scale: 1, y: 0 },
          {
            scale: 0.9,
            y: -120,
            scrollTrigger: {
              trigger: card,
              start: "top top",
              end: "+=120%",
              scrub: true,
              pin: true,
              pinSpacing: false,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    }, containerRef.current);

    // Refresh ScrollTrigger after animations are set up
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  };

  // Function to wait for images and refresh ScrollTrigger
  const waitForImagesAndRefresh = () => {
    if (!containerRef.current) return;
    
    const images = containerRef.current.querySelectorAll('img');
    let loadedImages = 0;
    const totalImages = images.length;

    if (totalImages > 0) {
      const checkAllLoaded = () => {
        loadedImages++;
        if (loadedImages === totalImages) {
          // All images loaded, refresh ScrollTrigger
          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
          });
        }
      };

      images.forEach((img) => {
        if (img.complete && img.naturalHeight !== 0) {
          // Image already loaded
          checkAllLoaded();
        } else {
          // Wait for image to load
          img.addEventListener('load', checkAllLoaded, { once: true });
          img.addEventListener('error', checkAllLoaded, { once: true }); // Handle errors too
        }
      });
    } else {
      // No images found, refresh anyway
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }
  };

  // Wait a bit to ensure all refs are set and DOM is ready
  const timeoutId = setTimeout(() => {
    initScrollTriggers();
    // Wait for images to load
    waitForImagesAndRefresh();
  }, 150);

  // Handle window resize
  const handleResize = () => {
    const width = window.innerWidth;
    if (width >= 768) {
      // On desktop - check if triggers exist
      const hasTriggers = ScrollTrigger.getAll().length > 0;
      if (!hasTriggers && containerRef.current) {
        // No triggers but we're on desktop - re-initialize
        // This handles the case when switching from mobile to desktop
        setTimeout(() => {
          initScrollTriggers();
          // Wait for images to load after re-initializing
          waitForImagesAndRefresh();
        }, 100);
      } else if (hasTriggers) {
        // Still on desktop with triggers, just refresh
        ScrollTrigger.refresh();
      }
    }
  };

  window.addEventListener('resize', handleResize);

  return () => {
    clearTimeout(timeoutId);
    window.removeEventListener('resize', handleResize);
    if (gsapContextRef.current) {
      gsapContextRef.current.revert();
      gsapContextRef.current = null;
    }
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
}, [mounted, isDesktop]);
useEffect(() => {
  if (!isDesktop) return;

  let cleanups = [];

  teamCursorRefs.current.forEach((card) => {
    if (!card) return;

    const cursor = card.querySelector(".emoji-cursor");
    if (!cursor) return;

    gsap.set(cursor, {
      x: 0,
      y: 0,
      opacity: 0,
      scale: 0.5,
    });

    const move = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(cursor, {
        x: x - 12,
        y: y - 12,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    const enter = () => {
      gsap.to(cursor, {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    const leave = () => {
      gsap.to(cursor, {
        opacity: 0,
        scale: 0.5,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    card.addEventListener("mousemove", move);
    card.addEventListener("mouseenter", enter);
    card.addEventListener("mouseleave", leave);

    cleanups.push(() => {
      card.removeEventListener("mousemove", move);
      card.removeEventListener("mouseenter", enter);
      card.removeEventListener("mouseleave", leave);
    });
  });

  return () => {
    cleanups.forEach((fn) => fn());
  };
}, [isDesktop]);

if (!mounted) return null;



  const teams = [
    {
      name: "Paw-Home Finder",
      role: "Adoption & Foster",
      bg: "#FFF4E8",
      accent: "#F28C8C",
      members: [
        {
          name: "Anjali",
          role: "Adoption Lead",
          image: "/team/anjali.jpeg",
          desc: "Ensures every rescued dog finds a safe and loving forever home.",
        },
      ],
    },
    {
      name: "Paw-Funding",
      role: "Funds",
      bg: "var(--earthy-cream)",
      accent: "#4FB6B2",
      members: [
        { name: "Shivali", role: "", image: "/team/shivalii.png" },
      ],
    },
    {
      name: "Paw-parazzi",
      role: "Social & Content",
      bg: "#FFF1C1",
      accent: "#4FB6B2",
      members: [{ name: "Manvi Anand", image: "/team/manvi.jpeg" }],
    },
    {
      name: "Paw-medics",
      role: "Rescue & Medical",
      bg: "var(--earthy-cream)",
      accent: "#C89B6A",
      members: [
        { name: "Akshay Pratap Singh Chauhan", image: "/team/akshay.jpeg" },
        { name: "Aditya Kr Sah", image: "/team/aditya.jpeg" },
        { name: "Advika Chowdhary", image: "/team/advika.jpeg" },
        { name: "Siya Gupta", image: "/team/siya.jpeg" },
      ],
    },
    {
      name: "Paw-Connect",
      role: "Rescue & Medical",
      bg: "var(--primary-sky)",
      accent: "#C89B6A",
      members: [
        { name: "Vaishali Kaushik", image: "/team/vaishali.jpeg" },
        { name: "Khwahish Kapil", image: "/team/khwahish.jpeg" },
        { name: "Yash Singh", image: "/team/yash.jpeg" },
        { name: "Anamika Singh", image: "/team/anamika.jpeg" },
        { name: "Tamanna", image: "/team/tamanna.jpeg" },
        { name: "Drishti", image: "/team/drishti.jpeg" },
      ],
    },
    {
      name: "Paw-ty Planners",
      role: "Feeding Management",
      bg: "var(--earthy-brown)",
      accent: "#4FB6B2",
      members: [
        { name: "Samika Kumar", image: "/team/samika.jpeg" },
        { name: "Aditi Mishra", image: "/team/aditi.jpeg" },
        { name: "Gaurav Beniwal", image: "/team/gaurav.jpeg" },
        { name: "Anika", image: "/team/anika.jpeg" },
        { name: "Aayushi Bisaria", image: "/team/aayushi.jpeg" },
        { name: "Ananya", image: "/team/ananya.jpeg" },
        { name: "Sherodha Tripathi", image: "/team/Sherodha.jpeg" },
      ],
    },
  ];

  return (
    <section ref={containerRef} className="bg-[#F9FBFC]">
      <Navbar />

      {/* HERO */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <Image src="/teamc.jpg" alt="Team" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <h1 className="relative text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-center leading-tight px-2">
          Meet Our Team
        </h1>
      </div>

      {/* STICKY STACK */}
      {teams.slice(1).map((team, idx) => (
        <div
          key={team.name}
          ref={(el) => (stackRef.current[idx] = el)}
          className="min-h-svh md:h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-0"
        >
<div
  ref={(el) => {
    teamCursorRefs.current[idx] = el;
  }}
  className={`relative cursor-none overflow-hidden
    w-full max-w-7xl rounded-2xl sm:rounded-3xl md:rounded-[3rem]
    shadow-xl sm:shadow-2xl
    p-4 sm:p-6 md:p-8 lg:p-10
    ${team.members.length === 1 ? "py-12 sm:py-16 md:py-24 lg:py-32" : "py-6 sm:py-8 md:py-10"}
  `}
  style={{ background: team.bg }}
>
  {/* icon CURSOR */}
<div className="emoji-cursor absolute top-0 left-0 pointer-events-none z-50 text-[38px] text-[#4FB6B2]">
{teamIconMap[team.name] || <IoPawSharp />}
</div>
            {team.name === "Paw-Funding" ? (
              
              <>
                <div className="hidden md:grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
                  {/* LEFT — PAW HOME FINDER */}
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3">
                      Paw-Home Finder
                    </h2>
                    <span className="inline-block mb-4 sm:mb-6 px-3 sm:px-4 py-1 text-sm sm:text-base rounded-full bg-[#F28C8C] text-white">
                      Adoption & Foster
                    </span>

                    <div className="mx-auto w-full max-w-[200px] sm:max-w-[240px] md:w-64 bg-white rounded-xl sm:rounded-2xl shadow-lg
      transition-all duration-300 ease-out
      hover:-translate-y-2
      hover:shadow-2xl
      hover:rotate-[0.5deg]
      active:scale-[0.98] overflow-hidden">
                      <div className="relative aspect-3/4">
                        <Image
                          src={teams[0].members[0].image}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3 sm:p-4">
                        <h4 className="font-bold text-sm sm:text-base">Anjali</h4>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT — PAW FUNDING */}
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3">
                      Paw-Funding
                    </h2>
                    <span
                      className="inline-block mb-4 sm:mb-6 px-3 sm:px-4 py-1 text-sm sm:text-base rounded-full text-white"
                      style={{ background: team.accent }}
                    >
                      Funds
                    </span>

                    <div className="mx-auto w-full max-w-[200px] sm:max-w-[240px] md:w-64 bg-white rounded-xl sm:rounded-2xl shadow-lg
      transition-all duration-300 ease-out
      hover:-translate-y-2
      hover:shadow-2xl
      hover:rotate-[0.5deg]
      active:scale-[0.98] overflow-hidden">
                      <div className="relative aspect-3/4">
                        <Image
                          src={team.members[0].image}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3 sm:p-4">
                        <h4 className="font-bold text-sm sm:text-base">{team.members[0].name}</h4>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MOBILE CAROUSEL */}
                <div className="md:hidden">
                  {/* PAW HOME FINDER */}
                  <div className={`text-center transition-opacity duration-300 ${pawFundingIndex === 0 ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                    <h2 className="text-2xl sm:text-3xl font-black mb-2 sm:mb-3">
                      Paw-Home Finder
                    </h2>
                    <span className="inline-block mb-4 sm:mb-6 px-3 sm:px-4 py-1 text-sm sm:text-base rounded-full bg-[#F28C8C] text-white">
                      Adoption & Foster
                    </span>

                    <div className="mx-auto w-full max-w-[200px] sm:max-w-[240px] bg-white rounded-xl sm:rounded-2xl shadow-lg
      transition-all duration-300 ease-out
      hover:-translate-y-2
      hover:shadow-2xl
      hover:rotate-[0.5deg]
      active:scale-[0.98] overflow-hidden">
                      <div className="relative aspect-3/4">
                        <Image
                          src={teams[0].members[0].image}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3 sm:p-4">
                        <h4 className="font-bold text-sm sm:text-base">Anjali</h4>
                      </div>
                    </div>
                  </div>

                  {/* PAW FUNDING */}
                  <div className={`text-center transition-opacity duration-300 ${pawFundingIndex === 1 ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                    <h2 className="text-2xl sm:text-3xl font-black mb-2 sm:mb-3">
                      Paw-Funding
                    </h2>
                    <span
                      className="inline-block mb-4 sm:mb-6 px-3 sm:px-4 py-1 text-sm sm:text-base rounded-full text-white"
                      style={{ background: team.accent }}
                    >
                      Funds
                    </span>

                    <div className="mx-auto w-full max-w-[200px] sm:max-w-[240px] bg-white rounded-xl sm:rounded-2xl shadow-lg
      transition-all duration-300 ease-out
      hover:-translate-y-2
      hover:shadow-2xl
      hover:rotate-[0.5deg]
      active:scale-[0.98] overflow-hidden">
                      <div className="relative aspect-3/4">
                        <Image
                          src={team.members[0].image}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3 sm:p-4">
                        <h4 className="font-bold text-sm sm:text-base">{team.members[0].name}</h4>
                      </div>
                    </div>
                  </div>

                  {/* MOBILE NAVIGATION BUTTONS */}
                  <div className="flex justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 ">
                    <button
                      disabled={pawFundingIndex === 0}
                      onClick={() => setPawFundingIndex(0)}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base rounded-full bg-white shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all min-w-[80px] sm:min-w-[100px]"
                    >
                      ‹ Prev
                    </button>

                    <button
                      disabled={pawFundingIndex === 1}
                      onClick={() => setPawFundingIndex(1)}
                      className=" px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base rounded-full bg-white shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all min-w-[80px] sm:min-w-[100px] "
                    >
                      Next ›
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* NORMAL TEAMS */}
                <div className="text-center mb-8 sm:mb-10 md:mb-14">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 px-2">
                    {team.name}
                  </h2>
                  <span
                    className="inline-block px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-full text-white"
                    style={{ background: team.accent }}
                  >
                    {team.role}
                  </span>
                </div>
                {(() => {
  const currentPage = page[idx] || 0;
  const start = currentPage * itemsPerPage;
  const visibleMembers = team.members.slice(
    start,
    start + itemsPerPage
  );

  return (
    <>
      {/* GRID */}
      <div className={`grid gap-4 sm:gap-5 md:gap-6 ${
    visibleMembers.length === 1
      ? "place-items-center"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
  }`}>
        {visibleMembers.map((m, i) => (
<div
key={`${team.name}-${m.name}`}
  className={`bg-white rounded-xl sm:rounded-2xl shadow-lg
    transition-all duration-300 ease-out
    hover:-translate-y-2
    hover:shadow-2xl
    hover:rotate-[0.5deg]
    active:scale-[0.98]
    w-full max-w-[280px] sm:max-w-none
    ${visibleMembers.length === 1 ? "w-full max-w-[200px] sm:max-w-[240px] md:max-w-[256px] lg:max-w-[288px]" : ""}
  `}
>
            <div className="relative aspect-3/4">
              <Image
                key={`${m.image}-${isDesktop}-${currentPage}-${idx}-${imageRemountKey}`}
                src={m.image}
                alt={m.name}
                fill
                className="object-cover rounded-t-xl sm:rounded-t-2xl"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                onLoad={() => {
                  // Force ScrollTrigger refresh when image loads
                  if (isDesktop) {
                    requestAnimationFrame(() => {
                      ScrollTrigger.refresh();
                    });
                  }
                }}
              />
            </div>
            <div className="p-3 sm:p-4 text-center">
              <h4 className="font-bold text-sm sm:text-base break-words">{m.name}</h4>
            </div>
          </div>
        ))}
      </div>

{/* PAGINATION BUTTONS */}
{/* Desktop: Paw-Connect and Paw-ty Planners only */}
{(team.name === "Paw-Connect" ||
  team.name === "Paw-ty Planners") && (
  <div className="hidden md:flex justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
    <button
      disabled={currentPage === 0}
      onClick={() =>
        setPage((p) => ({
          ...p,
          [idx]: currentPage - 1,
        }))
      }
      className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base rounded-full bg-white shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all min-w-[80px] sm:min-w-[100px]"
    >
      ‹ Prev
    </button>

    <button
      disabled={start + itemsPerPage >= team.members.length}
      onClick={() =>
        setPage((p) => ({
          ...p,
          [idx]: currentPage + 1,
        }))
      }
      className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base rounded-full bg-white shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all min-w-[80px] sm:min-w-[100px]"
    >
      Next ›
    </button>
  </div>
)}

{/* Mobile: Paw-medics, Paw-Connect, and Paw-ty Planners */}
{(team.name === "Paw-medics" ||
  team.name === "Paw-Connect" ||
  team.name === "Paw-ty Planners") && (
  <div className="md:hidden flex justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
    <button
      disabled={currentPage === 0}
      onClick={() =>
        setPage((p) => ({
          ...p,
          [idx]: currentPage - 1,
        }))
      }
      className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base rounded-full bg-white shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all min-w-[80px] sm:min-w-[100px]"
    >
      ‹ Prev
    </button>

    <button
      disabled={start + itemsPerPage >= team.members.length}
      onClick={() =>
        setPage((p) => ({
          ...p,
          [idx]: currentPage + 1,
        }))
      }
      className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base rounded-full bg-white shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all min-w-[80px] sm:min-w-[100px]"
    >
      Next ›
    </button>
  </div>
)}

    </>
  );
})()}


              </>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
