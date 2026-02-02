"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { IoPawSharp } from "react-icons/io5";


gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    gsap.from(contentRef.current, {
      opacity: 0,
      y: 60,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: contentRef.current,
        start: "top 85%",
      },
    });
  }, []);

  return (
    <section>
      
<footer
  className="relative bg-cover bg-center text-white [font-family:var(--font-poppins)]"
  style={{
    backgroundImage: "url('/gallery-section-images/footer-bg2.png')" // put your generated image in public folder
  }}
>

  {/* dark overlay for readability */}
  <div className="absolute inset-0 bg-black/30"></div>

  <div className="relative max-w-7xl mx-auto px-6 py-20  ">

    {/* top title */}
    <div className="text-center mb-14">
      <h2 className="text-5xl font-bold tracking-wide">DOOGOS IPU</h2>
      <p className="text-yellow-300 text-xl mt-2">
        Care. Rescue. Love.
      </p>
    </div>

    {/* footer grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-lg">

      {/* Quick links */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Quick Links</h3>
        <ul className="space-y-3 text-white/90">

          <li>
            <Link 
            href="/adoption"
            className="flex items-center gap-2 hover:text-teal-300 transition"
          >
            <IoPawSharp />
          Adoption
          </Link>
        </li>

       <li>
    <Link 
      href="/donate"
      className="flex items-center gap-2 hover:text-teal-300 transition"
    >
      <IoPawSharp />
      Donate
    </Link>
  </li>

  

</ul>

      </div>

    

      {/* Instagram */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Follow Us</h3>

        <a
          href="https://www.instagram.com/doggosofipu/"
          target="_blank"
          className="inline-flex items-center gap-3 bg-white/20 backdrop-blur px-5 py-3 rounded-full hover:bg-white/30 transition"
        >
          <img
            src="/insta-logo.png"
            className="w-8 h-8"
            alt="Instagram"
          />
          <span className="font-medium">@doggosipu</span>
        </a>
      </div>

    </div>

    {/* divider */}
    <div className="mt-16 border-t border-white/30 pt-6 text-center text-sm text-white/80">
      © 2026 DOOGOS IPU. All Rights Reserved.
    </div>

  </div>
</footer>
    </section>
  );
}