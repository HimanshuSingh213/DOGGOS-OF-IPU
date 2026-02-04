"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Navbar from "@/components/Navbar";

gsap.registerPlugin(ScrollTrigger);

export default function MeetOurTeam() {
  const stackRef = useRef([]);

  useEffect(() => {
    if(window.innerWidth < 768) return; // Disable on small screens
    stackRef.current.forEach((card, i) => {
      gsap.fromTo(
        card,
        {
          scale: 1,
          y: 0,
        },
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
          },
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

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
      members: [
        { name: "Manvi Anand", role: "", image: "/team/manvi.jpeg" },
      ],
    },
    {
      name: "Paw-medics",
      role: "Rescue & Medical",
      bg: "var(--earthy-cream)",
      accent: "#C89B6A",
      members: [
        { name: "Akshay Pratap Singh Chauhan", role: "", image: "/team/akshay.jpeg" },
        { name: "Aditya Kr Sah", role: "", image: "/team/aditya.jpeg" },
        { name: "Advika Chowdhary", role: "", image: "/team/advika.jpeg" },
        { name: "Siya Gupta", role: "", image: "/team/siya.jpeg" },
      ],
    },
    {
      name: "Paw-Connect",
      role: "Rescue & Medical",
      bg: "var(--primary-sky)",
      accent: "#C89B6A",
      members: [
        { name: "Vaishali Kaushik", role: "", image: "/team/vaishali.jpeg" },
        { name: "Khwahish Kapil", role: "", image: "/team/khwahish.jpeg" },
        { name: "Yash Singh", role: "", image: "/team/yash.jpeg" },
        { name: "Anamika Singh", role: "", image: "/team/anamika.jpeg" },
        { name: "Tamanna", role: "", image: "/team/tamanna.jpeg" },
        { name: "Drishti", role: "", image: "/team/drishti.jpeg" },
      ],
    },
    {
      name: "Paw-ty Planners",
      role: "Feeding Management",
      bg: "var(--earthy-brown)",
      accent: "#4FB6B2",
      members: [
        { name: "Samika Kumar", role: "", image: "/team/samika.jpeg" },
        { name: "Aditi Mishra", role: "", image: "/team/aditi.jpeg" },
        { name: "Gaurav Beniwal", role: "", image: "/team/gaurav.jpeg" },
        { name: "Anika", role: "", image: "/team/anika.jpeg" },
        { name: "Aayushi Bisaria", role: "", image: "/team/aayushi.jpeg" },
        { name: "Ananya", role: "", image: "/team/ananya.jpeg" },
        { name: "Sherodha Tripathi islls ", role: "", image: "/team/Sherodha.jpeg" },
      ],
    },
  ];

  return (
    <section className="bg-[#F9FBFC]">
      <Navbar />
      {/* HERO */}
      <div className="relative min-h-screen flex items-center justify-center">
        <Image src="/teamc.jpg" alt="Team" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <h1 className="relative text-white text-4xl sm:text-6xl md:text-8xl font-black text-center px-4">
          Meet Our Team
        </h1>
      </div>

      {/* HOME FINDER (NO STICKY) */}
      <div className="py-32 px-6">
        <div
          className="max-w-6xl mx-auto rounded-[3rem] md:rounded-[3rem] bg-white grid md:grid-cols-2 overflow-hidden shadow-2xl"
        >
          <div className="relative aspect-4/5">
            <Image src="/team/anjali.jpeg" alt="" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px" className="object-cover" priority />
          </div>
          <div className="p-8 md:p-14 flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Paw-Home Finder - Anjali</h2>
            <p className="text-xl text-gray-600 mb-6">Adoption & Foster</p>
            <p className="text-gray-700">
              Ensures every rescued dog finds a safe and loving forever home.
            </p>
          </div>
        </div>
      </div>

      {/* STICKY STACK TEAMS */}
      {teams.slice(1).map((team, idx) => (
        <div
          key={idx}
          ref={el => (stackRef.current[idx] = el)}
          className="min-h-screen md:h-screen flex items-center justify-center px-4 md:px-6"
        >
          <div
            className="w-full max-w-7xl rounded-4xl md:rounded-[3rem] p-6 sm:p-10 shadow-2xl"
            style={{ background: team.bg }}
          >
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">{team.name}</h2>
              <span
                className="inline-block px-6 py-2 rounded-full text-white"
                style={{ background: team.accent }}
              >
                {team.role}
              </span>
            </div>

            <div
              className={`flex overflow-x-auto gap-6 py-4 px-2 ${
                team.members.length === 1 ? "justify-center" : ""
              }`} >
              {team.members.map((m, i) => (
                <div
                  key={i}
                  className={`shrink-0 w-48 bg-white rounded-2xl shadow-lg ${
                    team.members.length === 1 ? "w-64 md:w-72" : "w-48"
                  }`}
                >
                  <div className="relative aspect-3/4 max-w-[288px] md:max-w-[288px] mx-auto">
                    <Image src={m.image} alt="" fill  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" className="object-cover rounded-t-2xl" />
                  </div>
                  <div className="p-4 text-center">
                    <h4 className="font-bold">{m.name}</h4>
                    <p className="text-sm text-gray-500">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
