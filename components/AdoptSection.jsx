'use client';

import { useEffect, useRef } from 'react';


import { ArrowRight } from 'lucide-react';

const dogs = [
  {
    name: 'SUNSHINE',
    breed: 'BREED: INDIAN PARIAH',
    sex: 'SEX: MALE',
    color: 'bg-emerald-500',
    image:
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
  },
  {
    name: 'SUGAR',
    breed: 'BREED: INDIAN PARIAH',
    sex: 'SEX: MALE',
    color: 'bg-lime-700',
    image:
      'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400&h=400&fit=crop',
  },
  {
    name: 'ROBIN',
    breed: 'BREED: INDIAN PARIAH',
    sex: 'SEX: FEMALE',
    color: 'bg-amber-800',
    image:
      'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400&h=400&fit=crop',
  },
  {
    name: 'MOWGLI',
    breed: 'BREED: INDIAN PARIAH',
    sex: 'SEX: FEMALE',
    color: 'bg-yellow-700',
    image:
      'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=400&h=400&fit=crop',
  },
];

export default function AdoptSection() {
  const adoptCardsRef = useRef([]);
  const adoptTitleRef = useRef(null);

  useEffect(() => {
    if (adoptTitleRef.current) {
      adoptTitleRef.current.style.opacity = '0';
      adoptTitleRef.current.style.transform = 'scale(0.9)';
      setTimeout(() => {
        if (adoptTitleRef.current) {
          adoptTitleRef.current.style.transition =
            'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
          adoptTitleRef.current.style.opacity = '1';
          adoptTitleRef.current.style.transform = 'scale(1)';
        }
      }, 500);
    }

    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    };

    const animateOnScroll = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.style.transition =
            'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
          target.style.opacity = '1';
          target.style.transform = 'translateY(0) scale(1)';
        }
      });
    };

    const observer = new IntersectionObserver(animateOnScroll, observerOptions);

    adoptCardsRef.current.forEach((card, index) => {
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px) scale(0.95)';
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* TITLE */}
        <div ref={adoptTitleRef} className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">
            ADOPT LOVE. ADOPT LIFE.
          </h2>
          <p className="text-lg opacity-70">
            One adoption can save a life and fill your home with unconditional
            love.
          </p>
        </div>

        {/* DOG CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {dogs.map((dog, index) => (
            <div
              key={dog.name}
              ref={(el) => {
                adoptCardsRef.current[index] = el;
              }}
              className={`${dog.color} rounded-3xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer`}
            >
              <img
                src={dog.image}
                alt={dog.name}
                className="w-full h-52 object-cover rounded-2xl mb-6"
              />

              <h3 className="text-2xl font-bold mb-2">{dog.name}</h3>
              <p className="text-sm opacity-90">{dog.breed}</p>
              <p className="text-sm opacity-90 mb-6">{dog.sex}</p>

              <button className="inline-flex items-center gap-2 font-semibold group">
                ADOPT ME
                <ArrowRight className="group-hover:translate-x-1 transition" />
              </button>
            </div>
          ))}
        </div>

        {/* FOOTER CTA */}
        <div className="mt-20 flex justify-center gap-10 font-semibold">
          <button className="flex items-center gap-2">
            VIEW MORE <ArrowRight />
          </button>

  <button className="flex items-center gap-2">
    EXPLORE GALLERY <ArrowRight />
  </button>


        </div>
      </div>
    </section>
  );
}
