"use client";

import React, { useState, useEffect } from "react";

const slides = [
  {
    badgeText: "KELAS AKAN DIMULAI",
    badgeColor: "#ef4444",
    title: "Frontend Web\nDevelopment Intro",
    date: "Hari ini, 15:00 WIB",
    mentor: "Reza Nugraha",
  },
  {
    badgeText: "KUIS HARI INI",
    badgeColor: "#f59e0b",
    title: "UI/UX Design\nFundamental",
    date: "Tenggat: 23:59 WIB",
    mentor: "Siti Aminah",
  },
  {
    badgeText: "MATERI BARU",
    badgeColor: "#3b82f6",
    title: "Belajar React JS\ndari Nol ke Mahir",
    date: "Tersedia sekarang",
    mentor: "Budi Santoso",
  },
  {
    badgeText: "PENGUMUMAN",
    badgeColor: "#10b981",
    title: "Jadwal Ujian\nAkhir Semester",
    date: "Mulai 15 Oktober 2026",
    mentor: "Admin Pusat",
  }
];

export default function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(-1);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      handleSlideChange((activeSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlide, isHovered]);

  const handleSlideChange = (index: number) => {
    if (index === activeSlide) return;
    setPrevSlide(activeSlide);
    setActiveSlide(index);
  };

  return (
    <div className="hero-banner-wrapper h-100" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="hero-layer-1"></div>
      <div className="hero-layer-2"></div>
      
      <div className="hero-banner position-relative overflow-hidden h-100 shadow-sm" style={{ minHeight: "320px", color: "white" }}>
        
        {slides.map((slide, index) => {
          let slideClass = "slide-waiting";
          if (index === activeSlide) {
            slideClass = "slide-active";
          } else if (index === prevSlide) {
            slideClass = "slide-exiting";
          }

          return (
            <div key={index} className={`position-absolute top-0 start-0 w-100 h-100 ${slideClass}`} style={{ background: "#561ea9" }}>
              
              <img 
                src="/images/hero-illustration.jpg"
                alt="Learning" 
                className="hero-image-blend d-none d-md-block" 
              />

              <div className="w-100 h-100 p-4 p-md-5 d-flex flex-column">
                <div className="row align-items-center h-100 pb-4">
                  
                  {/* TEKS (Kiri) */}
                  <div className="col-12 col-md-9 d-flex flex-column justify-content-center h-100 position-relative" style={{ zIndex: 2 }}>
                    <div className="pe-md-4">
                      <span className="badge bg-white text-primary fw-semibold px-3 py-2 mb-3 rounded-pill d-inline-flex align-items-center gap-2 shadow-sm" style={{ fontSize: "0.75rem" }}>
                        <span className="live-dot" style={{width:"8px",height:"8px",background:slide.badgeColor,borderRadius:"50%",display:"inline-block"}}></span> {slide.badgeText}
                      </span>
                      
                      <h3 className="fw-bold text-white mb-2" style={{ fontSize: "1.7rem", lineHeight: "1.3", letterSpacing: "-0.5px" }}>
                        {slide.title.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            {i === 0 && <br/>}
                          </React.Fragment>
                        ))}
                      </h3>
                      <p className="mb-4" style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.95rem", lineHeight: "1.5" }}>
                        <i className="far fa-clock me-1"></i> {slide.date}<br/>
                        <i className="far fa-user me-1 mt-2"></i> Mentor: {slide.mentor}
                      </p>
                      
                      <button className="btn px-4 py-2 fw-semibold rounded-3 shadow" style={{ fontSize: "0.9rem", background: "#111827", color: "white", border: "none", width: "fit-content" }}>
                        Gabung Kelas <i className="fas fa-arrow-right ms-2"></i>
                      </button>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          );
        })}

        <div className="position-absolute bottom-0 start-0 w-100 text-center z-3 pb-4 hero-dots">
          {slides.map((_, index) => (
            <span 
              key={index}
              className={`dot ${activeSlide === index ? 'active' : ''}`} 
              onClick={() => handleSlideChange(index)}
              style={{ cursor: "pointer", transition: "all 0.3s" }}
            ></span>
          ))}
        </div>
      </div>
      
      <style>{`
        /* --- CSS SLIDER --- */
        .slide-waiting, .slide-active, .slide-exiting {
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease;
        }
        .slide-waiting {
          transform: translateY(100%);
          opacity: 0;
          transition: none;
          z-index: 1;
        }
        .slide-active {
          transform: translateY(0);
          opacity: 1;
          z-index: 2;
        }
        .slide-exiting {
          transform: translateY(-100%);
          opacity: 0;
          z-index: 1;
        }
        
        /* --- CSS IMAGE BLEND (Tepat di Kanan) --- */
        .hero-image-blend {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          height: 100%;
          width: 55%;
          object-fit: cover;
          
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 40%, black 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 40%, black 100%);
          z-index: 1;
          pointer-events: none;
        }

                        /* --- CSS 3D LAYERS & BANNER --- */
        .hero-banner-wrapper {
          position: relative;
          margin-bottom: 36px;
          z-index: 1;
        }
        .hero-layer-1 {
          position: absolute;
          top: 0; bottom: 0; left: 0; right: 0;
          background: #561ea9; 
          opacity: 0.4;
          border-radius: 1.5rem;
          z-index: -1;
          transform: translateY(14px) scale(0.95);
          transition: all 0.3s ease;
        }
        .hero-layer-2 {
          position: absolute;
          top: 0; bottom: 0; left: 0; right: 0;
          background: #561ea9;
          opacity: 0.15;
          border-radius: 1.5rem;
          z-index: -2;
          transform: translateY(28px) scale(0.90);
          transition: all 0.3s ease;
        }
        .hero-banner {
          background: #561ea9;
          border-radius: 1.5rem;
          z-index: 2;
          box-shadow: 0 20px 40px -10px rgba(86, 30, 169, 0.5);
        }
        .hero-dots .dot {
          width: 8px;
          height: 8px;
          background: rgba(255,255,255,0.4);
          border-radius: 50%;
          display: inline-block;
          margin: 0 4px;
        }
        .hero-dots .dot.active {
          background: white;
        }
      `}</style>
    </div>
  );
}






