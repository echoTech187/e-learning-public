"use client";
import React, { useState, useRef, useEffect } from "react";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: "Tugas Baru", message: "Tugas HTML Form & Validasi telah ditambahkan.", time: "10 mnt lalu", unread: true, icon: "fa-code", color: "bg-danger" },
    { id: 2, title: "Pengingat Kelas", message: "Kelas Frontend Intro dimulai dalam 30 menit.", time: "30 mnt lalu", unread: true, icon: "fa-video", color: "bg-primary" },
    { id: 3, title: "Nilai Keluar", message: "Nilai Kuis Database MySQL sudah dirilis.", time: "1 hari lalu", unread: false, icon: "fa-star", color: "bg-success" },
  ];

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn elegant-btn d-flex align-items-center justify-content-center position-relative shadow-none border" 
        style={{ 
          width: "42px", 
          height: "42px", 
          borderRadius: "12px",
          background: "white",
          borderColor: "#e2e8f0",
          transition: "all 0.2s ease", 
          transform: isOpen ? "translateY(-1px)" : "none", 
          boxShadow: isOpen ? "0 8px 20px rgba(0,0,0,0.06)" : "0 2px 6px rgba(0,0,0,0.04)" 
        }}
        aria-label="Notifikasi"
      >
        <i className="fas fa-bell" style={{ color: "#64748b", fontSize: "1rem" }}></i>
        <span 
          className="position-absolute bg-danger border border-white rounded-circle" 
          style={{ width: "9px", height: "9px", top: "9px", right: "10px" }}
        ></span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop on mobile */}
          <div 
            className="d-md-none position-fixed top-0 start-0 w-100 h-100" 
            style={{ zIndex: 998, background: "rgba(15, 23, 42, 0.2)" }} 
            onClick={() => setIsOpen(false)} 
          />

          <div 
            className="position-absolute bg-white rounded-4 shadow-lg p-0" 
            style={{ 
              top: "50px", 
              right: "0", 
              width: "320px", 
              maxWidth: "calc(100vw - 32px)",
              zIndex: 1000, 
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15)",
              animation: "fadeIn 0.2s ease-out"
            }}
          >
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light" style={{ borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}>
              <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: "0.92rem" }}>Notifikasi</h6>
              <span className="badge bg-primary rounded-pill px-2 py-0.5" style={{ fontSize: "0.7rem" }}>2 Baru</span>
            </div>
            
            <div className="d-flex flex-column" style={{ maxHeight: "320px", overflowY: "auto" }}>
              {notifications.map(notif => (
                <div 
                  key={notif.id} 
                  className={`p-3 border-bottom d-flex gap-3 align-items-start`} 
                  style={{ 
                    cursor: "pointer", 
                    transition: "background 0.2s",
                    background: notif.unread ? "rgba(79, 70, 229, 0.03)" : "white"
                  }} 
                >
                  <div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${notif.color} text-white`} style={{ width: "36px", height: "36px" }}>
                    <i className={`fas ${notif.icon}`} style={{ fontSize: "0.85rem" }}></i>
                  </div>
                  <div className="flex-grow-1 min-w-0">
                    <h6 className={`mb-1 ${notif.unread ? 'fw-bold' : 'fw-semibold'} text-dark text-truncate`} style={{ fontSize: "0.85rem" }}>{notif.title}</h6>
                    <p className="mb-1 text-muted" style={{ fontSize: "0.78rem", lineHeight: "1.35" }}>{notif.message}</p>
                    <small className="text-primary fw-semibold" style={{ fontSize: "0.7rem" }}>{notif.time}</small>
                  </div>
                  {notif.unread && (
                    <div className="bg-primary rounded-circle mt-2" style={{ width: "7px", height: "7px", flexShrink: 0 }}></div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="p-2 text-center bg-white" style={{ borderBottomLeftRadius: "1rem", borderBottomRightRadius: "1rem" }}>
              <button className="btn btn-link text-decoration-none fw-semibold w-100 p-1" style={{ fontSize: "0.82rem", color: "#4f46e5" }}>
                Lihat Semua Notifikasi
              </button>
            </div>
          </div>
        </>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
