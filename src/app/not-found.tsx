import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "404 — Halaman Tidak Ditemukan | EduNusa",
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #f3f4f6", padding: "24px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#9ca3af", fontSize: 13, flexWrap: "wrap" as const, gap: 16 }}>
      <div>
        Butuh bantuan?&nbsp;&nbsp;
        <a href="mailto:support@edunusa.edu.id" style={{ color: "#6b7280", fontWeight: 500, textDecoration: "none" }}>support@edunusa.edu.id</a>
        &nbsp;|&nbsp;
        <a href="tel:+6281234567890" style={{ color: "#6b7280", fontWeight: 500, textDecoration: "none" }}>+62 812-3456-7890</a>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {["facebook-f", "instagram", "twitter", "telegram-plane"].map((icon) => (
          <a key={icon} href="#" style={{ width: 30, height: 30, border: "1px solid #e5e7eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", textDecoration: "none", fontSize: 12 }}>
            <i className={`fab fa-${icon}`} />
          </a>
        ))}
      </div>
    </footer>
  )
}

export default function NotFound() {
  return (
    <div style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "36px 48px", display: "flex", justifyContent: "center" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 20, fontWeight: 800, color: "#111827", textDecoration: "none", letterSpacing: "-0.03em" }}>
          <i className="fas fa-graduation-cap" style={{ color: "#4f46e5", fontSize: 22 }} /> EduNusa
        </Link>
      </header>
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 24px 80px", textAlign: "center" }}>
        <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: "-0.05em", color: "#f3f4f6", lineHeight: 1, marginBottom: -30 }}>404</div>
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 40, marginBottom: 32, minHeight: 170 }}>
          <svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg"
            style={{ animation: "magSwing 3s ease-in-out infinite", transformOrigin: "60px 60px", flexShrink: 0 }}>
            <circle cx="60" cy="60" r="46" fill="#eef2ff" />
            <circle cx="60" cy="60" r="46" fill="none" stroke="#6366f1" strokeWidth="12" />
            <text x="60" y="76" textAnchor="middle" fontFamily="Plus Jakarta Sans, Arial, sans-serif" fontSize="44" fontWeight="800" fill="#6366f1">?</text>
            <line x1="94" y1="94" x2="142" y2="142" stroke="#6366f1" strokeWidth="14" strokeLinecap="round" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ height: 10, width: 180, background: "#e0e7ff", borderRadius: 5, animation: "shimmer 2s ease-in-out infinite 0s" }} />
            <div style={{ height: 10, width: 130, background: "#e0e7ff", borderRadius: 5, animation: "shimmer 2s ease-in-out infinite 0.3s" }} />
            <div style={{ height: 10, width: 155, background: "#e0e7ff", borderRadius: 5, animation: "shimmer 2s ease-in-out infinite 0.6s" }} />
          </div>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", marginBottom: 12 }}>Halaman Tidak Ditemukan</h1>
        <p style={{ fontSize: 15, color: "#6b7280", maxWidth: 440, lineHeight: 1.7, marginBottom: 36 }}>
          Halaman yang Anda cari tidak ada, sudah dipindahkan, atau URL-nya mungkin salah ketik. Silakan kembali ke beranda.
        </p>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#111827", color: "#fff", fontSize: 14, fontWeight: 600, padding: "12px 28px", borderRadius: 8, textDecoration: "none" }}>
          <i className="fas fa-arrow-left" /> Kembali ke Beranda
        </Link>
      </main>
      <Footer />
      <style>{`
        @keyframes magSwing { 0%,100%{transform:rotate(-8deg)} 50%{transform:rotate(8deg)} }
        @keyframes shimmer  { 0%,100%{opacity:.4} 50%{opacity:1} }
      `}</style>
    </div>
  )
}
