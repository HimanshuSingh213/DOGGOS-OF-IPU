"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Home() {
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    gsap.from([titleRef.current, textRef.current, btnRef.current], {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });
  }, []);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ backgroundColor: "var(--primary-sky)" }}
    >
      <h1
        ref={titleRef}
        className="text-5xl font-bold mb-4"
      >
        🐾 Doggos of IPU
      </h1>

      <p
        ref={textRef}
        className="text-lg max-w-xl mb-6"
        style={{ color: "var(--text-gray)" }}
      >
        A student-led community creating a safer and kinder campus
        for our doggos.
      </p>

      <div ref={btnRef} className="flex gap-4">
        <button
          className="px-6 py-3 rounded-lg text-white text-lg hover:scale-105 transition"
          style={{ backgroundColor: "var(--primary-teal)" }}
        >
          Adopt a Dog 🐶
        </button>

        <button
          className="px-6 py-3 rounded-lg text-lg border hover:scale-105 transition"
          style={{
            backgroundColor: "var(--base-white)",
            borderColor: "var(--border-light)",
            color: "var(--text-dark)",
          }}
        >
          Join as Volunteer 🤍
        </button>
      </div>
    </main>
  );
}
