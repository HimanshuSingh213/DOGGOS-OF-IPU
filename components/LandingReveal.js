"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MdPets } from "react-icons/md";

export default function LandingReveal({ onFinish }) {

  /* ================= REFS ================= */

  const centreRef = useRef(null);
  const topoverlay = useRef(null);
  const bottomoverlay = useRef(null);
  const pawsRef = useRef([]);
  const textRef = useRef(null);

  /* ================= MAIN ANIMATION ================= */

  useEffect(() => {

    // Lock scrolling during reveal
    document.body.style.overflow = "hidden";

    const paws = pawsRef.current;

    // Initial paw state (hidden & off-screen feel)
    gsap.set(paws, { opacity: 0, x: -200 });

    const tl = gsap.timeline({
      onComplete: () => {
        // Unlock scroll when animation ends
        document.body.style.overflow = "auto";
        onFinish?.(); 
      },
    });

    /*  PAW WALK SEQUENCE */

    for (let i = 0; i < paws.length; i++) {

      // Show current paw
      tl.to(paws[i], {
        opacity: 1,
        duration: 0.12,
        ease: "power2.out",
      });

      // Hide paw two steps behind (walking illusion)
      if (i > 1) {
        tl.to(
          paws[i - 2],
          { opacity: 0, duration: 0.18 },
          "<"
        );
      }
    }

    // Fade last two paws before next phase
    tl.to(
      [paws[paws.length - 1], paws[paws.length - 2]],
      { opacity: 0, duration: 0.4 }
    );

    /*  CENTER SLIT CLOSE */

    tl.set(centreRef.current, { width: "100%" })
      .to(centreRef.current, {
        width: "0%",
        duration: 0.5,
        ease: "power3.out",
      });

    /*  FADE TEXT */

    tl.to(textRef.current, {
      opacity: 0,
      filter: "blur(6px)",
      duration: 0.1,
      ease: "power2.out",
    });

    // /*  SHUTTERS OPEN */

    tl.set([topoverlay.current, bottomoverlay.current], {
      height: "100%",
    }).to([topoverlay.current, bottomoverlay.current], {
      height: "0%",
      duration: 1,
      ease: "power3.out",
    });
    tl.to(
  [topoverlay.current, centreRef.current, bottomoverlay.current],
  { pointerEvents: "none", visibility: "hidden" }
);
    tl.set(".landing-overlay", { pointerEvents: "none" });
    tl.set(".landing-reveal", { display: "none" });



  }, []);

  /* ================= JSX ================= */

  return (
    <div className="fixed inset-0 z-9999 overflow-hidden landing-reveal">

    <div className="landing-overlay fixed inset-0 z-9999 overflow-hidden">

      {/* CENTER BRAND TEXT */}
      <div
        ref={textRef}
        className="absolute text-6xl font-bold tracking-widest z-10 
                   top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-(--text-dark)"
      >
        DOGOS IPU
      </div>

      {/* PAW TRAIL */}
      <div className="absolute top-1/2 left-1/2 
                      -translate-x-1/2 -translate-y-1/2 
                      z-20 flex">

        {[...Array(40)].map((_, i) => (
          <MdPets
            key={i}
            ref={(el) => (pawsRef.current[i] = el)}
            className="text-5xl rotate-90 text-(--earthy-cream)"
            style={{
              marginTop: i % 2 === 0 ? "0px" : "40px",
              opacity: 0,
            }}
          />
        ))}

      </div>

      {/* TOP SHUTTER */}
      <div
        ref={topoverlay}
        className="absolute top-0 left-0 w-full h-[49.7%] bg-(--primary-teal)"
      />

      {/* CENTER SLIT */}
      <div
        ref={centreRef}
        className="absolute top-1/2 left-0 w-screen h-[1.5%] 
                   bg-(--primary-teal) -translate-y-1/2"
      />

      {/* BOTTOM SHUTTER */}
      <div
        ref={bottomoverlay}
        className="absolute bottom-0 left-0 w-full h-[49.7%] bg-(--primary-teal)"
      />

    </div>
    </div>
  );
}
