
"use client";

import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import FeedingMap from "../components/FeedingMap";
import HowToHelp from "../components/HowToHelp";
import ContactSection from "../components/ContactSection";
import { useEffect, useState } from "react";
import LandingReveal from "../../components/LandingReveal";




import Navbar from "../components/Navbar";
export default function HomePage() {
  const [showReveal, setShowReveal] = useState(false);

useEffect(() => {
  const hasSeen = sessionStorage.getItem("seenReveal");

  if (!hasSeen) {
    setShowReveal(true);
    sessionStorage.setItem("seenReveal", "true");
  }
  // Clear on refresh/close so it plays again next load
    const clearReveal = () => {
      sessionStorage.removeItem("seenReveal");
    };

    window.addEventListener("beforeunload", clearReveal);

    return () => {
      window.removeEventListener("beforeunload", clearReveal);
    };
  
}, []);
  return (
     <>
      {showReveal && (
        <LandingReveal onFinish={() => setShowReveal(false)} />
      )}


    <main className="overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeedingMap />
      <HowToHelp />
      <ContactSection />
    </main>
      </>

  );
}
