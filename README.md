# 🐶 Doggos of IPU

**Doggos of IPU** is a modern web platform built to support animal welfare initiatives at IPU.  
The website focuses on **adoption, medical care, events, donations, and community engagement**, providing a smooth and engaging user experience.

---

## 🌟 Features

- 🏠 Informative Home Page with mission & highlights  
- 🐕 Adoption listings with detailed profiles  
- 🖼️ Image Gallery for rescued & adopted dogs  
- 🏥 Medical & Care awareness section  
- 💖 Donation support for animal welfare  
- 🤝 Join Us / Volunteer onboarding  
- 📢 Events, announcements & blogs (Admin managed)  
- 🔐 Admin Dashboard to manage content & uploads  

---

## 🛠️ Tech Stack

### Frontend
- **Next.js (App Router)**
- **React (JavaScript)**
- **Tailwind CSS**
- **GSAP** (Animations)

### Backend / Services
- **Next.js API Routes**
- **Database** (MongoDB / Supabase – configurable)
- **Image Storage** (Supabase Storage / Cloudinary)
- **Authentication** (Admin access)

---

## 📂 Project Structure

```bash
doggos-of-ipu/
├── src/
│   ├── app/
│   │   ├── page.jsx            # Home page
│   │   ├── layout.jsx          # Root layout
│   │   ├── adoption/           # Adoption page
│   │   ├── gallery/            # Gallery page
│   │   ├── medical/            # Medical & care page
│   │   ├── donate/             # Donation page
│   │   ├── join-us/            # Volunteer onboarding
│   │   └── api/                # Backend API routes
│   ├── components/             # Reusable UI components
│   ├── lib/                    # Database, auth & utilities
│   ├── assets/                 # Static images & icons
│   └── styles/                 # Global styles (optional)
├── public/                     # Public assets
├── README.md
└── package.json
