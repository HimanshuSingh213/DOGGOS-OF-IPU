"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  FaPaw,
  FaHome,
  FaUsers,
  FaDog,
  FaDonate,
  FaUserPlus,
} from "react-icons/fa";

export default function PawMenu() {
  const [open, setOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [pawPressed, setPawPressed] = useState(false);
  const pawPressTimerRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const updateCanHover = () => {
      setCanHover(mediaQuery.matches);
    };

    updateCanHover();
    mediaQuery.addEventListener("change", updateCanHover);

    return () => {
      mediaQuery.removeEventListener("change", updateCanHover);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (pawPressTimerRef.current) {
        clearTimeout(pawPressTimerRef.current);
      }
    };
  }, []);

  const triggerPawPulse = () => {
    setPawPressed(true);

    if (pawPressTimerRef.current) {
      clearTimeout(pawPressTimerRef.current);
    }

    pawPressTimerRef.current = setTimeout(() => {
      setPawPressed(false);
      pawPressTimerRef.current = null;
    }, 380);
  };

  const handleDesktopMouseLeave = () => {
    if (!canHover) return;
    setOpen(false);
    triggerPawPulse();
  };

  useEffect(() => {
    if (open) {
      setPawPressed(false);
      return;
    }

    const intervalId = setInterval(() => {
      triggerPawPulse();
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [open]);

  const items = [
    { name: "Home", href: "/", icon: <FaHome /> },
    { name: "Team", href: "/team", icon: <FaUsers /> },
    { name: "Gallery", href: "/gallery", icon: <FaDog /> },
    { name: "Adoption", href: "/adoption", icon: <FaDog /> },
    { name: "Donate", href: "/donate", icon: <FaDonate /> },
    { name: "Join Us", href: "/join-us", icon: <FaUserPlus /> },
    { name: "Events", href: "/events", icon: <FaUsers /> },
  ];

  return (
    <div
      className="fixed bottom-6 right-6 z-50"
      onMouseEnter={canHover ? () => setOpen(true) : undefined}
      onMouseLeave={canHover ? handleDesktopMouseLeave : undefined}
      style={{
        width: open ? 230 : 64,
        height: open ? 440 : 64,
      }}
    >
      {/* Floating Items (UPWARD) */}
      {items.map((item, i) => {
        const radius = open ? 72 + i * 58 : 0;

        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setOpen(false)}
            className="absolute bottom-0 right-2 flex items-center gap-3 bg-white shadow-xl rounded-full px-4 py-3 text-[#4FB6B2]"
            style={{
              transform: `translateY(-${radius}px) scale(${open ? 1 : 0})`,
              transition: "all 0.35s cubic-bezier(.68,-0.6,.32,1.6)",
            }}
          >
            {item.icon}
            <span className="font-medium text-gray-700">
              {item.name}
            </span>
          </Link>
        );
      })}

      {/* Paw Button */}
      <button
        onClick={canHover ? undefined : () => setOpen((prev) => !prev)}
        className={`absolute bottom-0 right-0 w-16 h-16 rounded-full bg-[#4FB6B2] flex items-center justify-center shadow-2xl text-white text-2xl transition duration-300 ${
          open ? "rotate-45" : ""
        } ${pawPressed && !open ? "scale-110" : "scale-100"}`}
        style={{
          backgroundColor: open || pawPressed ? "#368683" : "#4FB6B2",
        }}
      >
        <FaPaw />
      </button>
    </div>
  );
}
