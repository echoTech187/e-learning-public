import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "403 — Akses Ditolak | EduNusa",
}

export default function Forbidden() {
  return (
    <div style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "36px 48px", display: "flex", justifyContent: "center" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 20, fontWeight: 800, color: "#111827", textDecoration: "none", letterSpacing: "-0.03em" }}>
          <i className="fas fa-graduation-cap" style={{ color: "#4f46e5", fontSize: 22 }} /> EduNusa
        </Link>
      </header>
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 24px 80px", textAlign: "center" }}>
        <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: "-0.05em", color: "#f3f4f6", lineHeight: 1, marginBottom: -30 }}>403</div>
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 48, marginBottom: 32, minHeight: 170 }}>
          {/* Lock SVG */}
          <svg width="120" height="160" viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg"
            style={{ animation: "lockShake 4s ease-in-out infinite", flexShrink: 0 }}>
            {/* Shackle */}
            <path d="M30 80 L30 45 Q30 12 60 12 Q90 12 90 45 L90 80" fill="none" stroke="#d97706" strokeWidth="14" strokeLinecap="round"/>
            {/* Body */}
            <rect x="14" y="76" width="92" height="70" rx="12" fill="#f59e0b"/>
            {/* Keyhole circle */}
            <circle cx="60" cy="106" r="12" fill="#d97706"/>
            {/* Keyhole slit */}
            <rect x="55" y="110" width="10" height="16" rx="3" fill="#d97706"/>
          </svg>
          {/* Text lines */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Akses Ditolak</div>
            <div style={{ height: 8, width: 120, background: "#fde68a", borderRadius: 4 }} />
            <div style={{ height: 8, width: 80, background: "#fca5a5", borderRadius: 4 }} />
            <div style={{ height: 8, width: 100, background: "#fde68a", borderRadius: 4 }} />
          </div>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", marginBottom: 12 }}>Akses Ditolak</h1>
        <p style={{ fontSize: 15, color: "#6b7280", maxWidth: 440, lineHeight: 1.7, marginBottom: 36 }}>
          Anda tidak memiliki izin untuk mengakses halaman ini. Jika Anda merasa ini adalah kesalahan, silakan hubungi administrator.
        </p>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#111827", color: "#fff", fontSize: 14, fontWeight: 600, padding: "12px 28px", borderRadius: 8, textDecoration: "none" }}>
          <i className="fas fa-arrow-left" /> Kembali ke Beranda
        </Link>
      </main>
      <footer style={{ borderTop: "1px solid #f3f4f6", padding: "24px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#9ca3af", fontSize: 13, flexWrap: "wrap" as const, gap: 16 }}>
        <div>Butuh bantuan?&nbsp;&nbsp;<a href="mailto:support@edunusa.edu.id" style={{ color: "#6b7280", fontWeight: 500, textDecoration: "none" }}>support@edunusa.edu.id</a></div>
        <div style={{ display: "flex", gap: 10 }}>
          {["facebook-f","instagram","twitter","telegram-plane"].map((icon) => (
            <a key={icon} href="#" style={{ width: 30, height: 30, border: "1px solid #e5e7eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", textDecoration: "none", fontSize: 12 }}>
              <i className={`fab fa-${icon}`} />
            </a>
          ))}
        </div>
      </footer>
      <style>{`
        @keyframes lockShake {
          0%,85%,100%{transform:rotate(0deg)}
          88%{transform:rotate(-4deg)}
          92%{transform:rotate(4deg)}
          96%{transform:rotate(-2deg)}
        }
      `}</style>
    </div>
  )
}
