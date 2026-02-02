"use client";

import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
// import FeedingMap from "../components/FeedingMap";
import HowToHelp from "../components/HowToHelp";
import ContactSection from "../components/ContactSection";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      {/* <FeedingMap /> */}
      <HowToHelp />
      <ContactSection />
    </main>
  );
}