"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const MENU_ITEMS = [
  { href: "/dashboard", icon: "fas fa-home", label: "Beranda Dashboard" },
  { href: "/transactions", icon: "fas fa-receipt", label: "Riwayat Transaksi" },
  { href: "/settings", icon: "fas fa-cog", label: "Pengaturan" },
];

function UserDropdown({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  useEffect(() => {
    document.body.style.overflow = (isMobile && open) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, open]);

  const handleLogout = async () => {
    setOpen(false);
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/masuk");
    router.refresh();
  };

  const initials = (user?.name || "U").split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  const menuContent = (
    <>
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #6C47FF, #4f46e5)", color: "#fff", fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name || "Pengguna"}</div>
            <div style={{ color: "#64748b", fontSize: "0.8rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email || ""}</div>
          </div>
        </div>
      </div>
      <div style={{ padding: "8px 0" }}>
        {MENU_ITEMS.map(item => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 20px", color: "#334155", textDecoration: "none", fontSize: "0.92rem", fontWeight: 500, transition: "background 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ width: 30, height: 30, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <i className={item.icon} style={{ color: "#6C47FF", fontSize: "0.85rem" }}></i>
            </span>
            {item.label}
          </Link>
        ))}
        <div style={{ margin: "8px 20px", borderTop: "1px solid #f1f5f9" }}></div>
        <button onClick={handleLogout}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 20px", color: "#ef4444", background: "none", border: "none", cursor: "pointer", width: "100%", fontSize: "0.92rem", fontWeight: 600, transition: "background 0.15s", textAlign: "left" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#fff5f5")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <span style={{ width: 30, height: 30, borderRadius: 8, background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <i className="fas fa-sign-out-alt" style={{ color: "#ef4444", fontSize: "0.85rem" }}></i>
          </span>
          Keluar Akun
        </button>
      </div>
    </>
  );

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(v => !v)} aria-label="Profil pengguna"
        style={{ width: 40, height: 40, borderRadius: "50%", border: "none", cursor: "pointer", background: "linear-gradient(135deg, #6C47FF, #4f46e5)", color: "white", fontWeight: 700, fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(108,71,255,0.35)", transition: "transform 0.15s" }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        {initials}
      </button>

      {!isMobile && open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 10px)", zIndex: 9999, background: "#fff", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.14)", minWidth: 260, overflow: "hidden", animation: "udFadeDown 0.18s ease" }}>
          {menuContent}
        </div>
      )}

      {isMobile && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.25s ease" }} />
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 9999, width: "min(300px, 85vw)", background: "#fff", boxShadow: "-6px 0 32px rgba(0,0,0,0.18)", transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)", display: "flex", flexDirection: "column", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
              <span style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a" }}>Akun Saya</span>
              <button onClick={() => setOpen(false)} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fas fa-times" style={{ color: "#64748b", fontSize: "0.9rem" }}></i>
              </button>
            </div>
            {menuContent}
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{ __html: "@keyframes udFadeDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }" }} />
    </div>
  );
}

export default function Navbar({ isLoggedIn = false, user = null }: { isLoggedIn?: boolean, user?: any }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen((prev) => {
      document.body.classList.toggle("menu-open", !prev);
      return !prev;
    });
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.classList.remove("menu-open");
  };

  return (
    <nav className={`navbar-edu${scrolled ? " scrolled" : ""}`} id="mainNav">
      <div className="container">
        <Link href="/" className="navbar-brand-edu">
          <div className="brand-icon"><i className="fas fa-graduation-cap"></i></div>
          <span>EduNusa</span>
        </Link>

        <div className={`navbar-overlay${menuOpen ? " open" : ""}`} onClick={closeMenu}></div>

        <div className={`navbar-menu${menuOpen ? " open" : ""}`} id="navMenu">
          <div className="navbar-menu-header">
            <Link href="/" className="navbar-brand-edu m-0" onClick={closeMenu}>
              <div className="brand-icon brand-icon-sm"><i className="fas fa-graduation-cap"></i></div>
              <span>EduNusa</span>
            </Link>
            <button className="btn-close-menu" onClick={closeMenu}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="navbar-nav-links">
            <Link href="/" className={`nav-link-edu${pathname === "/" ? " active" : ""}`} onClick={closeMenu}>Beranda</Link>
            <Link href="/kursus" className={`nav-link-edu${pathname.startsWith("/kursus") ? " active" : ""}`} onClick={closeMenu}>Kursus</Link>
            <Link href="/tentang-kami" className={`nav-link-edu${pathname === "/tentang-kami" ? " active" : ""}`} onClick={closeMenu}>Tentang Kami</Link>
            <Link href="/kontak" className={`nav-link-edu${pathname === "/kontak" ? " active" : ""}`} onClick={closeMenu}>Kontak</Link>
          </div>

          <div className="navbar-actions">
            {isLoggedIn ? (
              <div style={{ position: "relative" }}>
                <UserDropdown user={user} />
              </div>
            ) : (
              <>
                <Link href="/masuk" className="btn-nav-outline" onClick={closeMenu}>Masuk</Link>
                <Link href="/daftar" className="btn-nav-primary" onClick={closeMenu}>Daftar Gratis</Link>
              </>
            )}
          </div>
        </div>

        <button className="navbar-toggler-edu" onClick={toggleMenu}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
}