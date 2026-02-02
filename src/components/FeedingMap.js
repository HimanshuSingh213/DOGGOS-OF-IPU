"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function FeedingMap() {
  const titleRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    gsap.from(mapContainerRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 1.2,
      scrollTrigger: {
        trigger: mapContainerRef.current,
        start: "top 85%",
      },
    });
  }, []);

  return (
    <section className="py-20 px-0 bg-(--base-white)">
      <div
        ref={mapContainerRef}
        className="relative w-full h-175 paw-cursor-map"
      >
        <Image
          src="/campus.png"
          alt="IPU Campus Map"
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
}
