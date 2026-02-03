"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function FeedingMap() {
  const titleRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
          once: true,
        },
      });

      // Map animation
      gsap.from(mapRef.current, {
        scale: 0.96,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: mapRef.current,
          start: "top 85%",
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="py-16 md:py-20 px-4"
      style={{ backgroundColor: "var(--base-white)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3"
            style={{ color: "var(--text-dark)" }}
          >
            Our Campus
          </h2>

          <p
            className="text-lg md:text-xl max-w-3xl mx-auto"
            style={{ color: "var(--text-gray)" }}
          >
            Explore GGSIPU Dwarka Campus — where every paw is cared for 🐾
          </p>
        </div>

        {/* Campus Map */}
        <div
          ref={mapRef}
          className="relative w-full h-125 max-h-[70vh] overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl paw-cursor-map"
        >
          <Image
            src="/campus.png"
            alt="GGSIPU Dwarka Campus Map"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          {/* Subtle depth overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.08) 100%)",
            }}
          />
        </div>

        {/* Footer text */}
        <p
          className="mt-8 text-center text-base md:text-lg"
          style={{ color: "var(--text-gray)" }}
        >
          Our volunteers operate across the entire campus, ensuring food, safety,
          and medical care for every dog.
        </p>
      </div>
    </section>
  );
}
