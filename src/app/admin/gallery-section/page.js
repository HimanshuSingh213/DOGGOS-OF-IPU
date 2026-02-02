"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { IoCloseCircle } from "react-icons/io5";

export default function AdminGallery() {

  /* ================= ReFS================= */

  const gridRef = useRef(null);
  const modalRef = useRef(null);
  const underlineRef = useRef(null);
  const tabsRef = useRef([]);


  /* ================= DELETE STaTe ================= */

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ================= UPLOAD STATE ================= */

  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("Feeding");
  const [fact, setFact] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= DATA ================= */

  const [images, setImages] = useState([]);

  /* ================= category ================= */  
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = [
  "All",
  "Feeding",
  "Medical",
  "Rescue",
  "Campus",
  "Adoption",
  "Event"
];



  /* ================= EDIT / PREVIEW ================= */

  const [editingImage, setEditingImage] = useState(null);
  const [editCategory, setEditCategory] = useState("");
  const [editFact, setEditFact] = useState("");

  /* ================= FETCH IMAGES ================= */

  const fetchImages = async () => {
  try {
    const res = await fetch("/api/gallery/get");
    const json = await res.json();   
    setImages(json || []);      
  } catch (err) {
    console.error("Failed to fetch images:", err);
    setImages([]);                   
  }
};

  useEffect(() => {
    fetchImages();
  }, []);

  /* ================= UPLOAD IMAGE ================= */

  const uploadImage = async () => {

    if (!file) return alert("Select an image first");

    setLoading(true);

    const reader = new FileReader();

    reader.onloadend = async () => {

      await fetch("/api/gallery/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: reader.result,
          category,
          fact
        })
      });

      setFile(null);
      setFact("");
      setLoading(false);

      fetchImages();
    };

    reader.readAsDataURL(file);
  };

  /* ================= DELETE IMAGE ================= */

  const deleteImage = async () => {

    if (!deleteTarget) return;

    setDeleteLoading(true);

    await fetch("/api/gallery/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: deleteTarget.id,
        image_path: deleteTarget.image_path
      })
    });

    setDeleteLoading(false);
    setDeleteTarget(null);

    fetchImages();
  };

  /* ================= START ediT ================= */

  const startEdit = (img) => {
    setEditingImage(img);
    setEditCategory(img.category);
    setEditFact(img.fact || "");
  };

  /* ================= SAVE EDIT ================= */

  const saveEdit = async () => {

    if (!editingImage) return;

    const res = await fetch("/api/gallery/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingImage.id,
        category: editCategory,
        fact: editFact
      })
    });

    if (!res.ok) return alert("Update failed");

    setEditingImage(null);
    fetchImages();
  };

  /* ================= MODAL ANIMATION ================= */

  useEffect(() => {

    if (!editingImage || !modalRef.current) return;

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

  }, [editingImage]);
  /* ================= category ANIMATION ================= */
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


  /* ================= GRID ANIMATION ================= */

  useEffect(() => {

    if (!gridRef.current || images.length === 0) return;

    requestAnimationFrame(() => {

      gsap.killTweensOf(gridRef.current.children);

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

    });

  }, [images]);


  const filteredImages =
  activeCategory === "All"
    ? images
    : images.filter(img => img.category === activeCategory);




  return (
    <div className="pb-16 space-y-12">

      {/* ================= UPLOAD PANEL ================= */}

      <div className="flex justify-center py-12 mt-[-20] bg-[url('/gallery-section-images/gallery-header-bg.png')] bg-cover min-h-110">

        <div className="bg-white/80 p-6 rounded-lg space-y-4 shadow-md w-full max-w-md">

          <h2 className="text-center [font-family:var(--font-poppins)] font-semibold text-2xl text-(--text-gray)">
            Upload Here
          </h2>



          <input
            className="border p-2 w-full cursor-pointer"
            type="file"
            onChange={e => setFile(e.target.files[0])}
          />

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border p-2 w-full rounded [font-family:var(--font-inter)] cursor-pointer"
          >
            <option>Feeding</option>
            <option>Medical</option>
            <option>Rescue</option>
            <option>Campus</option>
            <option>Adoption</option>
            <option>Event</option>
          </select>

          <textarea
            placeholder="Write story / moment..."
            value={fact}
            onChange={e => setFact(e.target.value)}
            className="border p-2 w-full rounded"
            rows={3}
          />

          <button
            onClick={uploadImage}
            className="bg-black text-white w-full py-2 rounded hover:opacity-90 [font-family:var(--font-poppins)]"
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>

        </div>
      </div>

      {/* ================= IMAGE GRID ================= */}

      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-xl font-semibold mb-6 [font-family:var(--font-inter)]">
          Uploaded Photos
        </h2>
{/* ================= CATEGORY FILTER BAR ================= */}

<div className="relative mb-8 border-b overflow-x-auto scrollbar-hide">

  <div className="relative flex gap-4 md:gap-6 whitespace-nowrap px-2">

    <span
      ref={underlineRef}
      className="absolute bottom-0 h-1 rounded-full bg-black"
    />

    {categories.map((cat, i) => (
      <button
        key={cat}
        ref={el => (tabsRef.current[i] = el)}
        onClick={() => setActiveCategory(cat)}
        className={`px-5 py-3 transition ${
          activeCategory === cat
            ? "text-black font-semibold"
            : "text-gray-400 hover:text-black"
        }`}
      >
        {cat}
      </button>
    ))}

  </div>
</div>


        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 [font-family:var(--font-poppins)]"
        >

          {filteredImages.map(img => (

            <div
              key={img.id}
              className="relative overflow-hidden rounded-lg shadow hover:shadow-xl transition"
            >

              <img
                src={img.image_url}
                className="w-full h-52 object-cover cursor-pointer hover:scale-105 transition-transform"
                onClick={() => startEdit(img)}
              />

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-(--earthy-cream) flex justify-between">

                <span className="font-medium">
                  {img.category}
                </span>

                <div className="flex gap-2">

                  <button
                    onClick={() => startEdit(img)}
                    className="bg-(--primary-teal) text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteTarget(img)}
                    className="bg-(--accent-coral) text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>

                </div>
              </div>

            </div>

          ))}

        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}

      {editingImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 [font-family:var(--font-inter)]">

          <div
            ref={modalRef}
            className="bg-black w-[92%] max-w-6xl h-[85vh] flex rounded-lg overflow-hidden shadow-2xl relative"
          >

             <button
                    onClick={() => {setEditingImage(null)}}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition cursor-pointer"
                  >
                    <IoCloseCircle className="text-4xl" />
                  </button>

            {/* IMAGE */}
            <div className="w-[60%] bg-black flex items-center justify-center">
              <img
                src={editingImage.image_url}
                className="max-h-full object-contain"
              />
            </div>

            {/* EDIT PANEL */}
            <div className="w-[40%] bg-white flex flex-col">

              <div className="p-5 border-b space-y-2">

                <h3 className="font-semibold text-lg">
                  Edit Photo Details
                </h3>

                <select
                  value={editCategory}
                  onChange={e => setEditCategory(e.target.value)}
                  className="border p-2 w-full rounded cursor-pointer"
                >
                  <option>Feeding</option>
                  <option>Medical</option>
                  <option>Rescue</option>
                  <option>Campus</option>
                  <option>Adoption</option>
                  <option>Event</option>
                </select>

              </div>

              <div className="flex-1 p-5 overflow-y-auto">

                <textarea
                  value={editFact}
                  onChange={e => setEditFact(e.target.value)}
                  rows={8}
                  className="border p-3 w-full rounded resize-none focus:outline-none focus:ring-2 focus:ring-black"
                />

              </div>

              <div className="p-4 border-t flex justify-end gap-3">

                <button
                  onClick={() => setEditingImage(null)}
                  className="px-4 py-2 border rounded hover:text-white hover:bg-black cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={saveEdit}
                  className="px-5 py-2 bg-(--secondary-green) text-white rounded hover:bg-[#22c772] cursor-pointer "
                >
                  Save Changes
                </button>

                <button
                  onClick={() => setDeleteTarget(editingImage)}
                  className="bg-(--accent-coral) text-white px-3 py-1 rounded text-sm hover:bg-[#de3838] cursor-pointer"
                >
                  Delete
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM ================= */}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-xl space-y-4">

            <h3 className="text-lg font-semibold text-gray-800">
              Delete this photo?
            </h3>

            <p className="text-sm text-gray-600">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-2">

              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={deleteImage}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:opacity-90"
              >
                {deleteLoading ? "Deleting..." : "Yes, Delete"}
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
