"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import dynamic from "next/dynamic";
import { renderToString } from "react-dom/server";
import { PawPrint } from "lucide-react";

const campusCenter = [28.595016, 77.018942];

// Importing leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const feedingSpots = [
  {
    id: 1,
    name: "Behind Hostels",
    position: [28.59535, 77.01695],
  },
  {
    id: 2,
    name: "Near Staff quarter Type-III",
    position: [28.59391, 77.01475],
  },
  {
    id: 3,
    name: "Near STP/Horticulture Area",
    position: [28.59365, 77.02061],
  },
];


gsap.registerPlugin(ScrollTrigger);

export default function FeedingMap() {
  const titleRef = useRef(null);
  const mapRef = useRef(null);
  const [pawIcon, setPawIcon] = useState(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;


  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
          once: true,
        },
      });

      // Map animation
      gsap.from(mapRef.current, {
        scale: 0.96,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: mapRef.current,
          start: "top 85%",
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  // Importing PawIcon
  useEffect(() => {
    import("leaflet").then((L) => {
      const icon = new L.DivIcon({
        html: renderToString(
          <div className="flex items-center justify-center bg-orange-500 text-white rounded-full shadow-lg w-10 h-10">
            <PawPrint size={20} />
          </div>
        ),
        className: "",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });

      setPawIcon(icon);
    });
  }, []);


  return (
    <section
      className="py-16 md:py-20 px-4"
      style={{ backgroundColor: "var(--base-white)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3"
            style={{ color: "var(--text-dark)" }}
          >
            Our Campus
          </h2>

          <p
            className="text-lg md:text-xl max-w-3xl mx-auto"
            style={{ color: "var(--text-gray)" }}
          >
            Explore GGSIPU Dwarka Campus — where every paw is cared for 🐾
          </p>
        </div>

        {/* Campus Map */}
        <div
          ref={mapRef}
          className="relative w-full h-[450px] md:h-[550px] overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl"
        >
          <MapContainer
            center={campusCenter}
            zoom={isMobile? 15 : 17}
            scrollWheelZoom={false}
            zoomControl={true}
            className="h-full w-full"
          >
            {/* Satellite View */}
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />

            {pawIcon &&
              feedingSpots.map((spot) => (
                <Marker key={spot.id} position={spot.position} icon={pawIcon}>
                  <Popup>
                    <div className="font-semibold text-sm">
                      {spot.name}
                    </div>
                  </Popup>
                </Marker>
              ))
            }

          </MapContainer>
        </div>

        {/* <Image
            src="/campus.png"
            alt="GGSIPU Dwarka Campus Map"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          /> */}

        {/* Subtle depth overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.08) 100%)",
          }}
        />

      {/* Footer text */}
      <p
        className="mt-8 text-center text-base md:text-lg"
        style={{ color: "var(--text-gray)" }}
      >
        Our volunteers operate across the entire campus, ensuring food, safety,
        and medical care for every dog.
      </p>
    </div>
    </section >
  );
}
