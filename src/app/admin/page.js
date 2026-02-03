import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

import {
  FaDog,
  FaHome,
  FaCalendarAlt,
  FaImages,
  FaPlus,
  FaListAlt,
  FaUserShield,
} from "react-icons/fa";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    redirect("/admin/login");
  }

  const { data: allDogs } = await supabase.from("adoptions").select("*");
  const { data: allEvents } = await supabase.from("events").select("*");
  const { data: allPictures } = await supabase.from("gallery").select("*");

  const stats = {
    totalDogs: allDogs?.length || 0,
    available: allDogs?.filter((d) => d.status === "available").length || 0,
    adopted: allDogs?.filter((d) => d.status === "adopted").length || 0,
    vaccinated: allDogs?.filter((d) => d.vaccinated === true).length || 0,
    totalEvents: allEvents?.length || 0,
    totalPictures: allPictures?.length || 0,
  };

  return (
    <div className="min-h-screen bg-(--base-white)">
      {/* NAVBAR */}
      <nav className="bg-(--base-white) border-b shadow-sm"
        style={{ borderColor: "var(--border-light)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaDog className="text-3xl text-(--primary-teal)" />
            <div>
              <h1 className="text-xl font-bold text-(--text-dark)">
                Doggos of IPU
              </h1>
              <p className="text-xs text-(--text-gray)">
                Admin Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-(--text-gray)">Logged in as</p>
              <p className="text-sm font-medium text-(--text-dark)">
                {user.email}
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold flex items-center gap-2 text-(--text-dark)">
            <FaUserShield className="text-(--primary-teal)" />
            Welcome Back
          </h2>
          <p className="mt-2 text-(--text-gray)">
            Manage adoptions, events and gallery
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Dogs"
            value={stats.totalDogs}
            icon={<FaDog />}
            bg="var(--primary-sky)"
            color="var(--primary-teal)"
          />

          <StatCard
            title="Available"
            value={stats.available}
            icon={<FaHome />}
            bg="var(--earthy-cream)"
            color="var(--secondary-green)"
          />

          <StatCard
            title="Total Events"
            value={stats.totalEvents}
            icon={<FaCalendarAlt />}
            bg="var(--secondary-yellow)"
            color="var(--primary-teal)"
          />

          <StatCard
            title="Gallery Pictures"
            value={stats.totalPictures}
            icon={<FaImages />}
            bg="var(--earthy-cream)"
            color="var(--accent-coral)"
          />
        </div>

        {/* ACTIONS */}
        <div className="bg-(--base-white) border rounded-2xl p-6 shadow-sm"
          style={{ borderColor: "var(--border-light)" }}>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FaDog className="text-(--primary-teal)" />
            Admin Actions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ActionCard
              href="/admin/adoptions/add"
              icon={<FaPlus />}
              title="Add New Dog"
              desc="Add a new dog for adoption"
              color="var(--secondary-green)"
            />

            <ActionCard
              href="/admin/adoptions"
              icon={<FaListAlt />}
              title="Manage Dogs"
              desc="View, edit or delete dogs"
              color="var(--primary-teal)"
            />

            <ActionCard
              href="/admin/events/add"
              icon={<FaPlus />}
              title="Add New Event"
              desc="Create upcoming events"
              color="var(--primary-teal)"
            />

            <ActionCard
              href="/admin/events"
              icon={<FaListAlt />}
              title="Manage Events"
              desc="Edit or delete events"
              color="var(--primary-teal)"
            />

            <ActionCard
              href="/admin/gallery-section"
              icon={<FaImages />}
              title="Manage Gallery"
              desc="Upload or remove images"
              color="var(--accent-coral)"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

/* -------- SMALL COMPONENTS -------- */

function StatCard({ title, value, icon, bg, color }) {
  return (
    <div
      className="p-6 rounded-2xl border shadow-sm"
      style={{ backgroundColor: bg, borderColor: color }}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-(--text-dark)">
            {title}
          </p>
          <p className="text-4xl font-bold mt-2" style={{ color }}>
            {value}
          </p>
        </div>
        <div className="text-5xl opacity-80" style={{ color }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActionCard({ href, icon, title, desc, color }) {
  return (
    <Link href={href}>
      <div
        className="p-5 border rounded-xl transition hover:shadow-md hover:scale-[1.01]"
        style={{ borderColor: "var(--border-light)" }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="text-2xl" style={{ color }}>
            {icon}
          </div>
          <p className="font-semibold text-lg text-(--text-dark)">
            {title}
          </p>
        </div>
        <p className="text-sm text-(--text-gray)">{desc}</p>
      </div>
    </Link>
  );
}
