import React from 'react';

export default function Home() {
  return (
    <main>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <img src="/logo.png" alt="Doggos IPU" />
          <div className="logo-text">
            <strong>DOGGOS</strong>
            <span>IPU</span>
          </div>
        </div>

        <div className="nav-pill">
          <a href="#">HOME</a>
          <a href="#">ABOUT US</a>
          <a href="#">SUPPORT US</a>
          <a href="#">JOIN US</a>
          <a href="#">CONTACT US</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Make a Difference</h1>
          <p>Support our furry friends</p>
          <button className="btn-primary">DONATE NOW</button>
        </div>
      </section>

      {/* Cards Section */}
      <section className="cards-container">
        {/* Left Card: Contribution */}
        <div className="card contribution-card">
          <h2>YOUR CONTRIBUTION</h2>
          
          <div className="icon-row">
            <div className="icon-item">
              <div className="img-circle">
                <img src="/dog1.png" alt="Feed a day" />
              </div>
              <span>Feed a day</span>
            </div>
            <div className="icon-item">
              <div className="img-circle">
                <img src="/dog2.png" alt="Vaccinations" />
              </div>
              <span>Vaccinations</span>
            </div>
            <div className="icon-item">
               <div className="img-circle">
                <img src="/dog3.png" alt="Medical Aid" />
              </div>
              <span>Medical Aid</span>
            </div>
          </div>

          <p className="card-text">
            Every rupee donated goes directly to rescuing, rehabilitating,
            and finding homes for dogs in need. We ensures full transparency in our operations.
          </p>
        </div>

        <div className="card transparency-card">
          <h2>TRANSPARENCY & TRUST</h2>
          
          <div className="payment-grid">
            <div className="qr-box">
              <img src="/qr.png" alt="QR Code" className="qr-img" />
            </div>
            <div className="payment-logos">
              <img src="/upi.png" alt="UPI" className="pay-logo" /> 
              <img src="/paytm.png" alt="Paytm" className="pay-logo" />
              <div className="small-logos">
                <img src="/gpay.png" alt="GPay" />
                <img src="/phonepe.png" alt="PhonePe" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thank You Banner */}
      <div className="banner">
        <p>Thank you for generous contribution! Your support helps us provide love and shelter to dogs in need.</p>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          {/* Left Column */}
          <div className="footer-left">
            <div className="footer-logo">
              <img src="/logo.png" alt="Logo" />
              <div className="logo-text-brown">
                <strong>DOOGOS</strong>
                <span>IPU</span>
              </div>
            </div>
            <p className="footer-desc">Help the life of our little paw friends. Contribute with a donation or help to adopt a pet.</p>
            
            <div className="footer-links">
              <p><strong>Privacy</strong></p>
              <p><strong>Terms and Condition</strong></p>
            </div>
          </div>

          {/* Right Column */}
          <div className="footer-right">
            <h3>CONTACT US</h3>
            <div className="social-icons">
              <img src="/instagram.png" alt="Insta" />
              <img src="/whatsapp.png" alt="Whatsapp" />
              <img src="/linkedin.png" alt="Linkedin" />
            </div>
            
            <div className="contact-info">
              <p>✉ <strong>EMAIL:</strong> example@email.com</p>
              <p>📍 <strong>ADDRESS:</strong> Guru Gobind Singh Indraprastha University, Sector-16C Dwarka, New Delhi 110078.</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
           <hr />
          <p>© 2026 DOOGOS IPU. All Rights Reserved.</p>
        </div>
      </footer>
    </main>
  );
}