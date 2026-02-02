"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const btnRef = useRef(null);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    // Typewriter effect for title
    const titleText = "Doggos\nof IPU";
    let currentIndex = 0;

    const typewriterInterval = setInterval(() => {
      if (currentIndex <= titleText.length) {
        setDisplayedText(titleText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typewriterInterval);
        
        // After typewriter completes, animate other elements
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
        
        tl.from(textRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.8,
        })
        .from(
          btnRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
          },
          "-=0.4"
        );
      }
    }, 100); // Typing speed in milliseconds

    return () => clearInterval(typewriterInterval);
  }, []);

  return (
    <section className="min-h-screen flex items-center px-5 py-20 justify-center relative overflow-hidden bg-sky-50">
      {/* Background Image - Clear and visible, no zoom */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/doggbg.jpg"
          alt="Happy dogs looking down"
          fill
          className="object-cover"
          priority
          quality={100}
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Light overlay for text readability */}
      <div className="absolute inset-0 bg-white/20" />

      {/* Center Content */}
      <div className="relative z-20 text-center max-w-5xl mx-auto">
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
          style={{
            fontFamily: "var(--font-poppins)",
            color: "var(--text-dark)",
            textShadow: "1px 1px 4px rgba(255, 255, 255, 0.95), -1px -1px 3px rgba(255, 255, 255, 0.9)",
          }}
        >
          {displayedText.includes('\n') ? (
            <>
              Doggos
              <br />
              <span style={{ color: "var(--earthy-brown)" }}>
                {displayedText.split('\n')[1]}
              </span>
            </>
          ) : (
            displayedText
          )}
          {displayedText.length < "Doggos\nof IPU".length && (
            <span className="animate-pulse">|</span>
          )}
          {displayedText === "Doggos\nof IPU" && (
            <span className="inline-block ml-4 text-5xl">🐾</span>
          )}
        </h1>

        <p
          ref={textRef}
          className="text-2xl md:text-2xl mb-12 leading-relaxed font-semibold px-4"
          style={{
            fontFamily: "var(--font-inter)",
            color: "black",
            textShadow: "1px 1px 4px rgba(255, 255, 255, 0.95), -1px -1px 6px rgba(255, 255, 255, 0.9)",
          }}
        >
          A student-led community creating a safer and kinder campus
          <br />
          for our four-legged friends for the past 7+ years. 
        </p>

        <div
          ref={btnRef}
          className="flex flex-wrap gap-6 justify-center items-center"
        >
        </div>
      </div>
    </section>
  );
}