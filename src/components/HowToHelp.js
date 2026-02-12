"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function HowToHelp() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.from(titleRef.current, {
      y: 40,
      duration: 0.8,
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 80%",
        once: true,
      },
    });

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      gsap.from(card, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
        delay: index * 0.15,
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


  const ways = [
    {
      title: "Adopt a Dog",
      description: "Give a campus dog their forever home. All dogs are vaccinated, sterilized, and ready for adoption. Change a life today.",
      image: "/adopt-help.jpg",
      link: "/adoption",
      color: "var(--primary-teal)",
    },
    {
      title: "Volunteer With Us",
      description: "Join our team of 50+ active volunteers. Help with daily feeding, medical care, and making our campus safer for every dog.",
      image: "/volunteer-helpp.jpg",
      link: "/join-us",
      color: "var(--secondary-green)",
    },
    {
      title: "Donate",
       description: "Support our mission with food supplies, medical care, or shelter costs. Every contribution helps us care for 60+ campus dogs.",
      image: "/donate-help.png",
      link: "/donate",
      color: "var(--secondary-yellow)",
    },
    {
      title: "Events",
      description: "Be part of our campus events from adoption camps to awareness drives and community activites for animal welfare.",
      image: "/event.jpg",
      link: "/events",
      color: "var(--accent-coral)",
    },
    {
      title: "View Our Gallery",
       description: "Relive heartwarming moments, adoption success stories, and the everyday joy shared between our volunteers and dogs.",
      image: "/gallery-help.png",
      link: "/gallery",
      color: "var(--primary-teal)",
    },
     {
      title: "Meet Our Team",
       description: "Get to know the passionate students and volunteers working behind the scenes to protect and care for campus dogs.",
      image: "/team-help.jpg",
      link: "/team",
      color: "var(--accent-coral)",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-20 px-4"
      style={{ backgroundColor: "var(--earthy-cream)" }}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          ref={titleRef}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 md:mb-4 px-4"
          style={{ color: "var(--text-dark)" }}
        >
          How You Can Help
        </h2>

        <p
          className="text-center text-lg md:text-xl mb-12 md:mb-16 max-w-3xl mx-auto px-4"
          style={{ color: "var(--text-gray)" }}
        >
          Every action counts. Join us in creating a safer, kinder campus for our four-legged friends.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          {ways.map((way, index) => (
            <Link href={way.link} key={index}>
              <div
                ref={(el) => (cardsRef.current[index] = el)}
                className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                style={{
                  height: "350px",
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0 bg-gray-200">
                  <Image
                    src={way.image}
                    alt={way.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Gradient Overlay */}
                <div 
                  className="absolute inset-0 bg-black/40 group-hover:bg-black/90 transition-colors duration-300"

                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  {/* Color accent bar */}
                  <div 
                    className="w-16 md:w-20 h-1 mb-3 md:mb-4 rounded-full"
                    style={{ backgroundColor: way.color }}
                  />
                  
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3 text-white">
                    {way.title}
                  </h3>
                  
                  <p className="text-white/90 text-base md:text-lg mb-3 md:mb-4 leading-relaxed line-clamp-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {way.description}
                  </p>

                  {/* Call to Action */}
                  <div className="flex items-center text-white font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    <span className="mr-2 text-sm md:text-base">Learn More</span>
                    <span className="text-lg md:text-xl">→</span>
                  </div>
                </div>

                {/* Hover overlay effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${way.color}20 0%, transparent 100%)`,
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}