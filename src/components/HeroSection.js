"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import {FaPaw} from "react-icons/fa";
export default function HeroSection() {
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const btnRef = useRef(null);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    const titleText = "Doggos of IPU";
    let currentIndex = 0;

    const typewriterInterval = setInterval(() => {
      if (currentIndex <= titleText.length) {
        setDisplayedText(titleText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typewriterInterval);

        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        tl.from(textRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.8,
        }).from(
          btnRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
          },
          "-=0.4"
        );
      }
    }, 100);

    return () => clearInterval(typewriterInterval);
  }, []);

  return (
    <section className="min-h-screen relative overflow-hidden bg-sky-50">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/doggbg.jpg"
          alt="Happy dogs looking down"
          fill
          priority
          quality={100}
          className="object-cover brightness-95 contrast-100 saturate-95"
        />
      </div>

      {/* Cloudy + Sky overlays */}
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-linear-to-b from-sky-200/10 via-transparent to-white/10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-5xl mx-auto px-5 pt-24 md:pt-32">
        {/* Heading */}
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl font-bold mb-4 leading-tight -translate-y-10"
          style={{
            fontFamily: "var(--font-poppins)",
            color: "var(--text-dark)",
            textShadow:
              "0px 1px 3px rgba(0,0,0,0.4)",
          }}
        >
          <span>Doggos </span>
          <span style={{ color: "var(--earthy-brown)" }}>of IPU <FaPaw className="inline-block ml-2" /> </span>
          {displayedText === "Doggos of IPU"}
        </h1>

        {/* Paragraph */}
        <p
          ref={textRef}
          className="text-lg md:text-xl -mt-8 md:-mt-10 mb-8 leading-relaxed font-light px-6"
          style={{
            fontFamily: "var(--font-inter)",
            color: "rgba(0,0,0,0.75)",
            textShadow: "0px 1px 2px rgba(0,0,0,0.25)",
          }}
        >
          A student-led community creating a safer and kinder campus
          <br />
          for our four-legged friends for the past 7+ years.
        </p>
      </div>
    </section>
  );
}
