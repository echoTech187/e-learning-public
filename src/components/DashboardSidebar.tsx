"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { logoutAction } from "@/app/actions/auth";

export default function DashboardSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roleName = user.role === "student" ? "Siswa" : user.role === "general" ? "Profesional" : "Orang Tua";
  const roleInitial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  let menuItems: { name: string; path: string; icon: string }[] = [];

  if (user.role === "student") {
    menuItems = [
      { name: "Beranda", path: "/dashboard", icon: "fas fa-home" },
      { name: "Kursus Saya", path: "/courses", icon: "fas fa-play-circle" },
      { name: "Riwayat Transaksi", path: "/transactions", icon: "fas fa-receipt" },
      { name: "Favorit", path: "/favorites", icon: "far fa-heart" },
      { name: "Tugas & Kuis", path: "/tasks", icon: "fas fa-tasks" },
      { name: "Prestasi", path: "/rewards", icon: "fas fa-trophy" },
      { name: "Sertifikat", path: "/certificates", icon: "fas fa-certificate" },
      { name: "Pengaturan", path: "/settings", icon: "fas fa-cog" },
    ];
  } else if (user.role === "general") {
    menuItems = [
      { name: "Beranda", path: "/dashboard", icon: "fas fa-home" },
      { name: "Kursus Saya", path: "/courses", icon: "fas fa-play-circle" },
      { name: "Riwayat Transaksi", path: "/transactions", icon: "fas fa-receipt" },
      { name: "Sertifikat", path: "/certificates", icon: "fas fa-certificate" },
      { name: "Pengaturan", path: "/settings", icon: "fas fa-cog" },
    ];
  } else {
    menuItems = [
      { name: "Ringkasan", path: "/dashboard", icon: "fas fa-home" },
      { name: "Anak Saya", path: "/children", icon: "fas fa-users" },
      { name: "Jadwal Kelas", path: "/schedule", icon: "far fa-calendar-alt" },
      { name: "Tagihan & Pembayaran", path: "/transactions", icon: "fas fa-file-invoice-dollar" },
      { name: "Pesan / Chat Mentor", path: "/messages", icon: "far fa-comments" },
      { name: "Pengaturan", path: "/settings", icon: "fas fa-cog" },
    ];
  }

  return (
    <>
      {isOpen && (
        <div
          className="d-lg-none"
          style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", backdropFilter: "blur(4px)", zIndex: 999 }}
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`dashboard-sidebar ${isOpen ? "show" : ""}`}>
        {/* Logo */}
        <div className="sidebar-header">
          <Link href="/" className="text-decoration-none d-flex align-items-center gap-2">
            <div className="d-flex align-items-center justify-content-center rounded-2 text-white" style={{ width: "32px", height: "32px", background: "#4f46e5" }}>
              <i className="fas fa-graduation-cap" style={{ fontSize: "0.85rem" }}></i>
            </div>
            <span className="fw-bold text-dark" style={{ fontSize: "1.1rem" }}>
              Edu<span style={{ color: "#4f46e5" }}>Nusa</span>
            </span>
          </Link>
        </div>

        {/* Menu */}
        <div className="sidebar-menu">
          <div className="menu-label">Menu</div>
          {menuItems.map((item, idx) => (
            <Link key={idx} href={item.path} className={`menu-item ${pathname === item.path ? "active" : ""}`} onClick={() => setIsOpen(false)}>
              <i className={item.icon}></i>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto px-3" style={{ paddingBottom: "16px", paddingTop: "12px" }}>
          <div className="dropdown w-100 dropend" ref={userDropdownRef}>
            <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="w-100 d-flex align-items-center justify-content-between border-0 bg-transparent p-2 rounded-3" type="button" aria-expanded={isUserDropdownOpen} style={{ transition: "all 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "1rem", flexShrink: 0 }}>
                  {roleInitial}
                </div>
                <div className="text-start" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "#0f172a", lineHeight: "1.2", marginBottom: "2px" }}>{user.name || "Test User"}</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "500", lineHeight: "1.2" }}>{roleName}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#94a3b8", fontSize: "0.55rem", gap: "3px" }}>
                <i className="fas fa-chevron-up"></i>
                <i className="fas fa-chevron-down"></i>
              </div>
            </button>
            
            {isUserDropdownOpen && (
              <ul className="dropdown-menu ms-2 mb-2 list-unstyled show" style={{ backgroundColor: "#ffffff", zIndex: 1050, borderRadius: "16px", minWidth: "240px", padding: "8px", border: "1px solid #e2e8f0", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)", listStyle: "none", position: "absolute", bottom: "0", left: "100%" }}>
                <li className="px-3 py-2 mb-1">
                  <div style={{ fontWeight: "700", fontSize: "0.95rem", color: "#0f172a" }}>{user.name || "Test User"}</div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{user.email || "user@edunusa.id"}</div>
                </li>
                
                <li><hr className="dropdown-divider my-1" style={{ borderColor: "#f1f5f9" }} /></li>
                
                <li className="mt-1">
                  <a className="dropdown-item d-flex align-items-center gap-3 py-2 px-3 rounded-3" href="#" style={{ fontSize: "0.85rem", color: "#334155", fontWeight: "500", transition: "all 0.2s" }} onMouseOver={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#334155'; }}>
                    <i className="far fa-user-circle" style={{ fontSize: "1.1rem", width: "20px", color: "#64748b" }}></i>
                    Profil Saya
                  </a>
                </li>
                <li>
                  <Link className="dropdown-item d-flex align-items-center gap-3 py-2 px-3 rounded-3" href="/transactions" style={{ fontSize: "0.85rem", color: "#334155", fontWeight: "500", transition: "all 0.2s" }} onMouseOver={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#334155'; }}>
                    <i className="fas fa-receipt" style={{ fontSize: "1.1rem", width: "20px", color: "#64748b" }}></i>
                    Riwayat Transaksi
                  </Link>
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center gap-3 py-2 px-3 rounded-3" href="#" style={{ fontSize: "0.85rem", color: "#334155", fontWeight: "500", transition: "all 0.2s" }} onMouseOver={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#334155'; }}>
                    <i className="fas fa-sliders-h" style={{ fontSize: "1.1rem", width: "20px", color: "#64748b" }}></i>
                    Pengaturan
                  </a>
                </li>
                
                <li><hr className="dropdown-divider my-1" style={{ borderColor: "#f1f5f9" }} /></li>
                
                <li className="mt-1">
                  <form action={logoutAction}>
                    <button type="submit" className="dropdown-item d-flex align-items-center gap-3 py-2 px-3 rounded-3 text-danger" style={{ fontWeight: "600", fontSize: "0.85rem", border: "none", backgroundColor: "transparent", width: "100%", textAlign: "left", transition: "all 0.2s" }} onMouseOver={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#dc2626'; }}>
                      <i className="fas fa-sign-out-alt" style={{ fontSize: "1.1rem", width: "20px" }}></i>
                      Keluar Akun
                    </button>
                  </form>
                </li>
              </ul>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sticky Top Header Bar */}
      <header className="d-lg-none d-flex align-items-center justify-content-between px-3 bg-white border-bottom sticky-top w-100 shadow-xs" style={{ height: "60px", zIndex: 990, flexShrink: 0 }}>
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-light border p-0 d-flex align-items-center justify-content-center rounded-3 shadow-none"
            style={{ width: "38px", height: "38px", background: "#f8fafc" }}
            onClick={() => setIsOpen(true)}
            aria-label="Buka Menu"
          >
            <i className="fas fa-bars text-dark" style={{ fontSize: "1rem" }}></i>
          </button>
          <Link href="/" className="text-decoration-none d-flex align-items-center gap-2 ms-1">
            <div className="d-flex align-items-center justify-content-center rounded-2 text-white" style={{ width: "30px", height: "30px", background: "#4f46e5" }}>
              <i className="fas fa-graduation-cap" style={{ fontSize: "0.8rem" }}></i>
            </div>
            <span className="fw-bold text-dark" style={{ fontSize: "1.05rem", letterSpacing: "-0.02em" }}>
              Edu<span style={{ color: "#4f46e5" }}>Nusa</span>
            </span>
          </Link>
        </div>

        {/* Right side: Catalog button & Interactive Avatar Dropdown */}
        <div className="d-flex align-items-center gap-2 position-relative">
          <Link href="/kursus" className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 d-none d-sm-inline-flex align-items-center gap-1" style={{ fontSize: "0.78rem", fontWeight: 600 }}>
            <i className="fas fa-compass"></i> Katalog
          </Link>

          {/* Interactive Clickable Avatar Button */}
          <button
            type="button"
            onClick={() => setIsMobileUserMenuOpen(!isMobileUserMenuOpen)}
            className="btn p-0 border-0 rounded-circle position-relative"
            aria-label="Menu Pengguna"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "0.9rem",
              flexShrink: 0,
              cursor: "pointer",
              boxShadow: isMobileUserMenuOpen ? "0 0 0 3px rgba(79, 70, 229, 0.3)" : "0 2px 8px rgba(0,0,0,0.08)",
              transition: "all 0.2s ease",
              transform: isMobileUserMenuOpen ? "scale(1.05)" : "scale(1)",
            }}
          >
            {roleInitial}
          </button>

          {/* Mobile User Dropdown Menu */}
          {isMobileUserMenuOpen && (
            <>
              {/* Invisible Backdrop to close on tap outside */}
              <div
                className="position-fixed top-0 start-0 w-100 h-100"
                style={{ zIndex: 998, background: "rgba(15, 23, 42, 0.15)" }}
                onClick={() => setIsMobileUserMenuOpen(false)}
              />

              {/* Popup Dropdown Box */}
              <div
                className="position-absolute end-0 bg-white rounded-4 shadow-lg border p-2"
                style={{
                  top: "48px",
                  width: "250px",
                  zIndex: 999,
                  borderColor: "#e2e8f0",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                  animation: "dropdownSlideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {/* User Header */}
                <div className="px-3 py-2 border-bottom mb-1">
                  <div style={{ fontWeight: "700", fontSize: "0.92rem", color: "#0f172a" }}>{user.name || "Test User"}</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }} className="text-truncate">{user.email || "user@edunusa.id"}</div>
                  <span className="badge mt-1 rounded-pill" style={{ background: "#e0e7ff", color: "#4f46e5", fontSize: "0.68rem" }}>
                    {roleName}
                  </span>
                </div>

                {/* Menu Items */}
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileUserMenuOpen(false)}
                  className="d-flex align-items-center gap-3 py-2 px-3 rounded-3 text-decoration-none text-dark"
                  style={{ fontSize: "0.85rem", fontWeight: 500, transition: "background 0.15s" }}
                  onMouseOver={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <i className="fas fa-home text-muted" style={{ width: "18px" }}></i>
                  Dashboard
                </Link>

                <Link
                  href="/transactions"
                  onClick={() => setIsMobileUserMenuOpen(false)}
                  className="d-flex align-items-center gap-3 py-2 px-3 rounded-3 text-decoration-none text-dark"
                  style={{ fontSize: "0.85rem", fontWeight: 500, transition: "background 0.15s" }}
                  onMouseOver={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <i className="fas fa-receipt text-muted" style={{ width: "18px" }}></i>
                  Riwayat Transaksi
                </Link>

                <Link
                  href="/kursus"
                  onClick={() => setIsMobileUserMenuOpen(false)}
                  className="d-flex align-items-center gap-3 py-2 px-3 rounded-3 text-decoration-none text-dark"
                  style={{ fontSize: "0.85rem", fontWeight: 500, transition: "background 0.15s" }}
                  onMouseOver={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <i className="fas fa-compass text-muted" style={{ width: "18px" }}></i>
                  Jelajahi Kursus
                </Link>

                <hr className="my-1" style={{ borderColor: "#f1f5f9" }} />

                {/* Logout Action */}
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-100 text-start border-0 bg-transparent d-flex align-items-center gap-3 py-2 px-3 rounded-3 text-danger"
                    style={{ fontWeight: "600", fontSize: "0.85rem", transition: "background 0.15s" }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#fef2f2")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <i className="fas fa-sign-out-alt" style={{ width: "18px" }}></i>
                    Keluar Akun
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </header>

      <style>{`
        @keyframes dropdownSlideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
