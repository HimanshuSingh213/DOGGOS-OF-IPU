"use client"

import Hero from '../../components/Hero';
import AdoptSection from '../../components/AdoptSection';
import ReportCase from '../../components/ReportCase';
import WaysToHelp from '../../components/WaysToHelp';
import MissionVision from '../../components/MissionVision';
import Instagram from '../../components/Instagram';
import RabiesCampus from '../../components/RabiesCampus';
import CTASection from '../../components/CTASection';
import Footer from '../../components/Footer';
import LandingReveal from '../../components/LandingReveal';
import { useEffect, useState } from 'react';

export default function Home() {

  const [showReveal, setShowReveal] = useState(false);

  useEffect(() => {
    const isReload =
      performance.getEntriesByType("navigation")[0]?.type === "reload";

    const hasSeen = sessionStorage.getItem("seenReveal");

    // Show if first visit OR refresh
    if (!hasSeen || isReload) {
      setShowReveal(true);
      sessionStorage.setItem("seenReveal", "true");
    }
  }, []);

  return (
    <>
      {showReveal && (
        <LandingReveal onFinish={() => setShowReveal(false)} />
      )}

      <Hero />
      <AdoptSection />
      <ReportCase />
      <WaysToHelp />
      <MissionVision />
      <Instagram />
      <RabiesCampus />
      <CTASection />
      <Footer />
    </>
  );
}
