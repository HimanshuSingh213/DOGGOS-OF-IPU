"use client";

import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import FeedingMap from "../components/FeedingMap";
import HowToHelp from "../components/HowToHelp";
import ContactSection from "../components/ContactSection";
import LandingReveal from "../components/LandingReveal";

export default function HomePage() {
  const [showLanding, setShowLanding] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const hasSeenLanding = sessionStorage.getItem("hasSeenLanding");

    if (!hasSeenLanding) {
      setShowLanding(true);
      sessionStorage.setItem("hasSeenLanding", "true");
    }

    setIsReady(true);
  }, []);


  if (!isReady) {
    return <></>;
  }

  return (
    <>
      {showLanding ? (
        <LandingReveal onFinish={() => setShowLanding(false)} />
      ) : (
        <main className="overflow-x-hidden">
          <Navbar />
          <HeroSection />
          <AboutSection />
          <FeedingMap />
          <HowToHelp />
          <ContactSection />
        </main>
      )}
    </>
  );
}
