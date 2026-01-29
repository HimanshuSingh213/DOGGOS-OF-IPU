"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";


/* ================= ICON IMPORTS ================= */

import { IoPawSharp, IoSchoolSharp, IoCloseCircle } from "react-icons/io5";
import { GiDogHouse } from "react-icons/gi";
import { FaCameraRetro, FaHeart } from "react-icons/fa";
import { BsFillHouseHeartFill } from "react-icons/bs";
import { MdDriveFolderUpload, MdNavigateNext } from "react-icons/md";
import { MdMedicalServices } from "react-icons/md";



export default function GalleryPage() {

  const [loading, setLoading] = useState(true);



  /* ================= CATEGORY STATE ================= */

  const [activeCategory, setActiveCategory] = useState("All");

  /* ================= REAL DATA ================= */

  const [images, setImages] = useState([]);

  /* ================= MODAL STATE ================= */

  const [selectedImage, setSelectedImage] = useState(null);
  const [likedImages, setLikedImages] = useState({});
  const [likeLoading, setLikeLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  /* ================= REFS ================= */

  const heartRef = useRef(null);
  const modalRef = useRef(null);
  const gridRef = useRef(null);
  const underlineRef = useRef(null);
  const tabsRef = useRef([]);
  const gallerySectionRef = useRef(null);

  /* ================= CATEGORY ICON MAP ================= */

  const categoryIcons = {
    Feeding: <IoPawSharp />,
    Medical: <MdMedicalServices />,
    Rescue: <BsFillHouseHeartFill />,
    Campus: <IoSchoolSharp />,
    Adoption: <GiDogHouse />,
    Event: <FaCameraRetro />
  };

  /* ================= CATEGORY LIST ================= */

  const categories = [
    "All",
    "Feeding",
    "Medical",
    "Rescue",
    "Campus",
    "More"
  ];

  /* ================= LOAD LIKES ================= */

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("likedImages")) || {};
    setLikedImages(saved);
  }, []);

  /* ================= FETCH IMAGES ================= */

  useEffect(() => {
    fetch("/api/gallery/get")
      .then(res => res.json())
      .then(data => {
  setImages(data);
  setLoading(false);
});

  }, []);

  /* ================= FILTER LOGIC ================= */

  const filteredItems =
    activeCategory === "All"
      ? images
      : activeCategory === "More"
        ? images.filter(item =>
            item.category === "Adoption" ||
            item.category === "Event"
          )
        : images.filter(item => item.category === activeCategory);

  /* ================= HERO ANIMATION ================= */

  useEffect(() => {
    gsap.from(".hero-anim", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out"
    });
  }, []);

  /* ================= CUSTOM CURSOR ================= */

  useEffect(() => {

    let cleanups = [];

    const timeoutId = setTimeout(() => {

      const cards = document.querySelectorAll(".image-card");

      cards.forEach(card => {

        const icon = card.querySelector(".camera-cursor");
        if (!icon) return;

        gsap.set(icon, { x: 0, y: 0, opacity: 0, scale: 0.5 });

        const move = e => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          gsap.to(icon, {
            x: x - 12,
            y: y - 12,
            duration: 0.12,
            ease: "power2.out"
          });
        };

        const enter = () => {
          gsap.to(icon, {
            opacity: 1,
            scale: 1,
            duration: 0.15,
            ease: "power2.out"
          });
        };

        const leave = () => {
          gsap.to(icon, {
            opacity: 0,
            scale: 0.5,
            duration: 0.15,
            ease: "power2.out"
          });
        };

        card.addEventListener("mousemove", move);
        card.addEventListener("mouseenter", enter);
        card.addEventListener("mouseleave", leave);

        cleanups.push(() => {
          card.removeEventListener("mousemove", move);
          card.removeEventListener("mouseenter", enter);
          card.removeEventListener("mouseleave", leave);
        });

      });

    }, 0);

    return () => {
      clearTimeout(timeoutId);
      cleanups.forEach(fn => fn());
    };

  }, [filteredItems]);

  /* ================= MODAL OPEN ANIMATION ================= */

  useEffect(() => {

    if (!isModalOpen || !modalRef.current) return;

    gsap.fromTo(
      modalRef.current,
      { scale: 0.6, opacity: 0, y: 40 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power3.out"
      }
    );

  }, [isModalOpen]);

  /* ================= SLIDER CONTROLS ================= */

  const nextImage = () => {
    const next = (currentIndex + 1) % filteredItems.length;
    setCurrentIndex(next);
    setSelectedImage(filteredItems[next]);
  };

  const prevImage = () => {
    const prev = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setCurrentIndex(prev);
    setSelectedImage(filteredItems[prev]);
  };

  /* ================= GRID ANIMATION ================= */

  useEffect(() => {

    if (!gridRef.current) return;

    gsap.fromTo(
      gridRef.current.children,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out"
      }
    );

  }, [activeCategory]);

  /* ================= TAB UNDERLINE ================= */

  useEffect(() => {

    const index = categories.indexOf(activeCategory);
    const tab = tabsRef.current[index];

    if (!tab || !underlineRef.current) return;

    gsap.to(underlineRef.current, {
      x: tab.offsetLeft,
      width: tab.offsetWidth,
      duration: 0.6,
      ease: "elastic.out(1, 0.6)"
    });

  }, [activeCategory]);

  /* ================= LIKE SYSTEM ================= */

  const toggleLike = async (item) => {

    if (likeLoading) return;

    setLikeLoading(true);

    const alreadyLiked = likedImages[item.id];
    const change = alreadyLiked ? -1 : 1;

    gsap.fromTo(
      heartRef.current,
      { scale: 0.7 },
      {
        scale: 1.5,
        duration: 0.25,
        ease: "back.out(3)",
        onComplete: () =>
          gsap.to(heartRef.current, { scale: 1, duration: 0.15 })
      }
    );

    try {

      await fetch("/api/gallery/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          change
        })
      });

      const updatedLiked = {
        ...likedImages,
        [item.id]: !alreadyLiked
      };

      localStorage.setItem("likedImages", JSON.stringify(updatedLiked));
      setLikedImages(updatedLiked);

      setImages(prev =>
        prev.map(img =>
          img.id === item.id
            ? { ...img, likes: Math.max(0, img.likes + change) }
            : img
        )
      );

      setSelectedImage(prev => ({
        ...prev,
        likes: Math.max(0, prev.likes + change)
      }));

    } finally {
      setLikeLoading(false);
    }
  };



  return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--base-white)" }}>

        {/* ================= HERo ================= */}

        <section className="relative min-h-125 flex flex-col items-center justify-center text-center px-4 py-16 bg-[url('/gallery-section-images/gallery-header-bg.png')] bg-cover">
          <div className="absolute inset-0 bg-black/20"></div>

          <div className="relative z-10 max-w-4xl">

            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="paw-icon h-20 w-20 rounded-full border-4 flex justify-center items-center" style={{borderColor:"var(--primary-teal)"}}>
                <IoPawSharp className=" text-6xl" style={{color:"var(--primary-teal)"}}/>
              </div>

              <h1 className="hero-anim  text-5xl md:text-6xl font-bold [font-family:var(--font-poppins)]" style={{ color: "var(--text-dark)" }}>
                Our Gallery
              </h1>
            </div>

            <p className="hero-anim text-lg md:text-xl mb-8 [font-family:var(--font-poppins)] pb-1" style={{ color: "var(--text-gray)" }}>
              Moments from feeding drives, medical care & campus love
            </p>

            <button
              className=" px-7 py-3 rounded-lg text-white text-lg font-semibold hover:scale-105 transition-transform shadow-lg [font-family:var(--font-poppins)] cursor-pointer"
              style={{ backgroundColor: "var(--primary-teal)" }}
              onClick={() =>
              gallerySectionRef.current?.scrollIntoView({
              behavior: "smooth"
              })
              }
            >
              Browse Moments
            </button>

            <div className="hero-anim flex flex-wrap justify-center gap-6 mt-12">

              <div className=" flex items-center gap-3 px-6 py-3 rounded-full bg-(--earthy-cream) [font-family:var(--font-poppins)]">
                <FaCameraRetro className="text-3xl text-(--secondary-green) "/>
                <span>120+ Photos</span>
              </div>

              <div className="flex items-center gap-3 px-6 py-1 rounded-full bg-(--earthy-cream) [font-family:var(--font-poppins)]">
                <MdDriveFolderUpload className=" text-4xl text-(--secondary-yellow)"/>
                <span>15+ Drives</span>
              </div>

              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-(--earthy-cream) [font-family:var(--font-poppins)]">
                <BsFillHouseHeartFill className="text-3xl text-(--accent-coral)"/>
                <span>30+ Rescue Stories</span>
              </div>

            </div>
          </div>
        </section>


        {/* ================= CATEGORY TABS ================= */}

        <section ref={gallerySectionRef} className="border-b [font-family:var(--font-poppins)]" style={{borderColor:"var(--border-light)"}}>
          <div className="max-w-7xl mx-auto relative flex gap-4 md:gap-6 
                overflow-x-auto scrollbar-hide 
                whitespace-nowrap px-2 ">

            <span
              ref={underlineRef}
              className="absolute bottom-0 h-1 rounded-full"
              style={{background:"var(--primary-teal)"}}
            />

            {categories.map((category, i) => (
              <button
                key={category}
                ref={el => (tabsRef.current[i] = el)}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-4 transition ${
                  activeCategory === category
                    ? "text-(--primary-teal)"
                    : "text-(--text-gray)] hover:text-(--primary-teal) hover:cursor-pointer"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>


        {/* ================= REAL GALLERY GRID ================= */}

        <section className="py-12 px-4 [font-family:var(--font-poppins)]">
          <div className="max-w-7xl mx-auto">

            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >

              {/* REAL DATA MAPPING (UPDATED) */}
              {loading
  ? Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="relative overflow-hidden rounded-lg shadow-md h-72 bg-gray-300 animate-pulse"
      />
    ))
  : filteredItems.map(item => (

                <div
                  key={item.id}
                 onClick={() => {setSelectedImage(item) ; setCurrentIndex(filteredItems.indexOf(item)); setIsModalOpen(true);}}
                  className="image-card relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-none"
                >
                  <div className="camera-cursor absolute top-0 left-0 pointer-events-none z-10">
                  <FaCameraRetro className="text-(--primary-teal) text-4xl drop-shadow-lg" />
                  </div>

                  {/* REAL IMAGE FROM SUPABASE */}
                  <div className="relative w-full h-72 overflow-hidden">

  {/* loading placeholder */}
  <div className="absolute inset-0 bg-gray-300 animate-pulse" />

  <img
    src={item.image_url}
    alt={item.category}
    className="w-full h-full object-cover hover:scale-105 transition-transform opacity-0"
    onLoad={e => {
      e.currentTarget.style.opacity = 1;
      e.currentTarget.previousSibling.style.display = "none";
    }}
  />

</div>


                  <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2 bg-(--earthy-cream)">
                      <span className="text-2xl text-(--primary-teal)">
                          {categoryIcons[item.category]}
                      </span>

                      <span className="font-medium">
                          {item.category}
                      </span>
                  </div>

                </div>
              ))}

            </div>

          </div>

          {/* ================= POPUP MODAL ================= */}

{selectedImage && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

    <div
      ref={modalRef}
      className="bg-white  w-[92%] max-w-6xl h-[85vh] flex overflow relative shadow-2xl"
    >

      {/* Close */}
      <button
        onClick={() => {setSelectedImage(null); setIsModalOpen(false);}}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition cursor-pointer"
      >
        <IoCloseCircle className="text-4xl" />
      </button>

      {/* LEFT — IMAGE */}
      <div className="w-[60%] bg-black flex items-center justify-center">
        <button
          onClick={prevImage}
          className="absolute left-[-20]  bg-black/80 text-white text-4xl hover:scale-110 transition cursor-pointer"
        >  <MdNavigateNext className="rotate-180" />
      </button>

      <button
        onClick={nextImage}
        className="absolute right-110 bg-black/80 text-white text-4xl hover:scale-110 transition cursor-pointer"
      > <MdNavigateNext />
      </button>
        <img
          src={selectedImage.image_url}
          className="max-h-full object-contain"
        />
      </div>

      {/* RIGHT — STORY PANEL */}
      <div className="w-[40%] flex flex-col bg-(--earthy-brown)/70">

        {/* Header */}
        <div className="p-5 border-b flex items-center gap-3">
          <span className="text-xl text-(--primary-teal)">
            {categoryIcons[selectedImage.category]}
          </span>
          <h3 className="font-semibold text-lg [font-family:var(--font-poppins)]">
            {selectedImage.category}
          </h3>
        </div>

        {/* Story */}
        <div className="flex-1 overflow-y-auto p-5 text-gray-700 leading-relaxed [font-family:var(--font-inter)]">
          {selectedImage.fact}
        </div>

        {/* Like Bar */}
        <div className="p-4 border-t flex items-center gap-3">

          <button
            disabled={likeLoading}
            onClick={() => toggleLike(selectedImage)}
            className={`transition flex items-center gap-2 ${
              likedImages[selectedImage.id]
                ? "text-red-500"
                : "text-gray-400 hover:text-red-400"
            }`}
          >
            <FaHeart ref={heartRef} className="text-3xl"/>
            <span className="font-medium text-gray-700">
              {selectedImage.likes}
            </span>
          </button>

        </div>

      </div>
    </div>
  </div>
)}

        </section>


        {/* ================= FOOTER ================= */}

<footer
  className="relative bg-cover bg-center text-white [font-family:var(--font-poppins)]"
  style={{
    backgroundImage: "url('/gallery-section-images/footer-bg2.png')" // put your generated image in public folder
  }}
>

  {/* dark overlay for readability */}
  <div className="absolute inset-0 bg-black/30"></div>

  <div className="relative max-w-7xl mx-auto px-6 py-20  ">

    {/* top title */}
    <div className="text-center mb-14">
      <h2 className="text-5xl font-bold tracking-wide">DOOGOS IPU</h2>
      <p className="text-yellow-300 text-xl mt-2">
        Care. Rescue. Love.
      </p>
    </div>

    {/* footer grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-lg">

      {/* Quick links */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Quick Links</h3>
        <ul className="space-y-3 text-white/90">

          <li>
            <Link 
            href="/adoption"
            className="flex items-center gap-2 hover:text-teal-300 transition"
          >
            <IoPawSharp />
          Adoption
          </Link>
        </li>

       <li>
    <Link 
      href="/donate"
      className="flex items-center gap-2 hover:text-teal-300 transition"
    >
      <IoPawSharp />
      Donate
    </Link>
  </li>

  

</ul>

      </div>

    

      {/* Instagram */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Follow Us</h3>

        <a
          href="https://www.instagram.com/doggosofipu/"
          target="_blank"
          className="inline-flex items-center gap-3 bg-white/20 backdrop-blur px-5 py-3 rounded-full hover:bg-white/30 transition"
        >
          <img
            src="/gallery-section-images/insta-logo.png"
            className="w-8 h-8"
            alt="Instagram"
          />
          <span className="font-medium">@doggosipu</span>
        </a>
      </div>

    </div>

    {/* divider */}
    <div className="mt-16 border-t border-white/30 pt-6 text-center text-sm text-white/80">
      © 2026 DOOGOS IPU. All Rights Reserved.
    </div>

  </div>
</footer>


      </div>
  );
}
