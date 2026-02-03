"use client";

import Image from "next/image";
import ContactSection from "@/components/ContactSection";

export default function DonatePage() {
  return (
    <main className="bg-white text-gray-800">

      {/* HERO */}
      <section
        className="relative h-175 flex items-end justify-center text-center"
        style={{
          background: "url('/hero.png') center bottom / cover no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/60 mt-80" />

        <div className="relative mb-28 text-white px-6">
          <h1 className="text-[48px] md:text-[110px] font-bold leading-none">
            Make a Difference
          </h1>
          <p className="text-2xl md:text-5xl font-serif mt-2">
            Support our furry friends
          </p>

          <button className="mt-6 px-10 py-3 rounded-full bg-teal-700 text-white font-bold tracking-wide text-lg hover:bg-teal-800 transition">
            DONATE NOW
          </button>
        </div>
      </section>

      {/* CARDS */}
      <section className="flex flex-col lg:flex-row gap-8 justify-center px-6 py-16">
        {/* Contribution Card */}
        <div className="w-full max-w-120 bg-[#eef1f3] border-2 border-gray-400 rounded-2xl p-8 text-center">
          <h2 className="text-sm font-bold tracking-wide mb-6">
            YOUR CONTRIBUTION
          </h2>

          <div className="flex justify-around mb-6">
            {[
              { img: "/dog1.png", label: "Feed a day" },
              { img: "/dog2.png", label: "Vaccinations" },
              { img: "/dog3.png", label: "Medical Aid" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <div className="w-22.5 h-22.5 rounded-full overflow-hidden border-4 border-teal-300">
                  <Image src={item.img} alt={item.label} width={90} height={90} />
                </div>
                <span className="font-serif font-semibold text-lg">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <p className="font-serif text-left text-gray-700 leading-relaxed">
            Every rupee donated goes directly to rescuing, rehabilitating, and
            finding homes for dogs in need. We ensure full transparency in our
            operations.
          </p>
        </div>

        {/* Transparency Card */}
        <div className="w-full max-w-120 bg-[#eef1f3] border-2 border-gray-400 rounded-2xl p-8 text-center">
          <h2 className="text-sm font-bold tracking-wide mb-6">
            TRANSPARENCY & TRUST
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Image src="/qr.png" alt="QR Code" width={190} height={190} />

            <div className="flex flex-col items-start gap-3">
              <Image src="/upi.png" alt="UPI" width={120} height={60} />
              <Image src="/paytm.png" alt="Paytm" width={120} height={60} />
              <div className="flex gap-6 self-center mt-2">
                <Image src="/gpay.png" alt="GPay" width={45} height={45} />
                <Image src="/phonepe.png" alt="PhonePe" width={45} height={45} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THANK YOU BANNER */}
      <div className="mx-6 my-10 bg-gray-200 rounded-[40px] px-6 py-10 text-center">
        <p className="font-serif text-xl md:text-2xl font-bold">
          Thank you for your generous contribution! Your support helps us provide
          love and shelter to dogs in need.
        </p>
      </div>
      <ContactSection />
    </main>
  );
}
