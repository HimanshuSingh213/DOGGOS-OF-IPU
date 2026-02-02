"use client";

export default function DogPaws() {
  return (
    <>
      <div className="pointer-events-none fixed left-2 top-0 z-20 flex h-screen flex-col justify-evenly md:left-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="animate-paw text-xl opacity-0 md:text-2xl"
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            🐾
          </span>
        ))}
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes paw {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.8);
          }
          25% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
          75% {
            opacity: 0.5;
          }
          100% {
            opacity: 0;
            transform: translateY(20px) scale(1);
          }
        }

        .animate-paw {
          animation: paw 3.2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
