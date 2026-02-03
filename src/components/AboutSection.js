"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { IoPawSharp, IoSchoolSharp, IoCloseCircle } from "react-icons/io5";


gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const headingRef = useRef(null);
  const descRef = useRef(null);
  const missionRef = useRef(null);

  useEffect(() => {
  const ctx = gsap.context(() => {
    // Heading
    gsap.from(headingRef.current, {
      y: 30,
      duration: 1,
      scrollTrigger: {
        trigger: headingRef.current,
        start: "top 80%",
        once: true,
      },
    });

    // Description
    gsap.from(descRef.current, {
      y: 20,
      duration: 0.8,
      delay: 0.2,
      scrollTrigger: {
        trigger: descRef.current,
        start: "top 80%",
        once: true,
      },
    });

    // Stat cards
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      gsap.from(card, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        delay: index * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          once: true,
        },
      });
    });

    ScrollTrigger.refresh();
  }, sectionRef);

  return () => {
    ctx.revert();
    ScrollTrigger.getAll().forEach(t => t.kill());
  };
}, []);


  const stats = [
    { number: "60+", label: "Dogs Vaccinated", image: "/stat1.jpg" },
    { number: "30+", label: "Dogs Sterilized", image: "/stat2.jpg" },
    { number: "6", label: "Dogs Adopted", image: "/stat3.jpg" },
    { number: "300+", label: "Community Members", image: "/stat4.jpg" },
    { number: "100%", label: "Rabies-Free Campus", image: "/stat5.jpg" },
    { number: "7+", label: "Years of Service", image: "/stat6.jpg" },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4"
      style={{ backgroundColor: "var(--base-white)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h2
          ref={headingRef}
          className="text-5xl md:text-6xl font-bold text-center mb-8"
          style={{ color: "var(--text-dark)" }}
        >
          About Us
          <IoPawSharp className="ml-2 inline-block" style={{ color: "var(--primary-teal)" }} />
        </h2>

        {/* Description */}
        <p
          ref={descRef}
          className="text-center text-xl md:text-2xl max-w-4xl mx-auto mb-16 leading-relaxed"
          style={{ color: "var(--text-gray)" }}
        >
          Doggos of IPU is a student-led animal welfare community working inside the IPU campus 
          for the past <strong style={{ color: "var(--primary-teal)" }}>7+ years</strong>. What started small has now become a 
          family of around <strong style={{ color: "var(--primary-teal)" }}>300 people</strong>, with <strong style={{ color: "var(--primary-teal)" }}>50+ active team members</strong> who 
          consistently work towards peaceful coexistence between humans and dogs on campus.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
              style={{ height: "280px" }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={stat.image}
                  alt={stat.label}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Overlay */}
              <div 
                className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center">
                <div
                  className="text-6xl font-bold mb-2 text-white"
                >
                  {stat.number}
                </div>
                <div
                  className="text-xl font-semibold text-white"
                >
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}