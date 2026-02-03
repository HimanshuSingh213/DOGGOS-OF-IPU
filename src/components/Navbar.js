"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaPaw,
  FaHome,
  FaUsers,
  FaDog,
  FaDonate,
} from "react-icons/fa";

export default function PawMenu() {
  const [open, setOpen] = useState(false);

  const items = [
    { name: "Home", href: "/", icon: <FaHome /> },
    { name: "Team", href: "/team", icon: <FaUsers /> },
    { name: "Gallery", href: "/gallery", icon: <FaDog /> },
    { name: "Adoption", href: "/adoption", icon: <FaDog /> },
    { name: "Donate", href: "/donate", icon: <FaDonate /> },
    {name: "Events", href: "/events", icon: <FaUsers /> },
  ];

  return (
    <div className="fixed top-6 right-6 z-50">
      {/* Floating Items (DOWNWARD) */}
      {items.map((item, i) => {
        const radius = open ? 72 + i * 58 : 0;

        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setOpen(false)}
            className="absolute right-2 flex items-center gap-3 bg-white shadow-xl rounded-full px-4 py-3 text-[#4FB6B2]"
            style={{
              transform: `translateY(${radius}px) scale(${open ? 1 : 0})`,
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
        onClick={() => setOpen(!open)}
        className={`w-16 h-16 rounded-full bg-[#4FB6B2] flex items-center justify-center shadow-2xl text-white text-2xl transition ${
          open ? "rotate-45" : ""
        }`}
      >
        <FaPaw />
      </button>
    </div>
  );
}
