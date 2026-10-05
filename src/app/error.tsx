"use client"
import Link from "next/link"
import { useEffect } from "react"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "36px 48px", display: "flex", justifyContent: "center" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 20, fontWeight: 800, color: "#111827", textDecoration: "none", letterSpacing: "-0.03em" }}>
          <i className="fas fa-graduation-cap" style={{ color: "#4f46e5", fontSize: 22 }} /> EduNusa
        </Link>
      </header>
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 24px 80px", textAlign: "center" }}>
        <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: "-0.05em", color: "#f3f4f6", lineHeight: 1, marginBottom: -30 }}>500</div>
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 48, marginBottom: 32, minHeight: 170 }}>
          {/* Server rack */}
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                [true, false], [true, true], [false, false], [true, false]
              ].map(([l, r], i) => (
                <div key={i} style={{ width: 120, height: 20, background: "#374151", borderRadius: 4, display: "flex", alignItems: "center", padding: "0 8px", gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: l ? "#ef4444" : "#6b7280", animation: l ? "blink 0.4s infinite" : "none" }} />
                  <div style={{ flex: 1, height: 4, background: "#4b5563", borderRadius: 2 }} />
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: r ? "#ef4444" : "#6b7280", animation: r ? "blink 0.5s infinite" : "none" }} />
                </div>
              ))}
            </div>
            <span style={{ position: "absolute", top: 5, right: -28, fontSize: 24, animation: "sparkFly 2s ease-out infinite" }}>⚡</span>
            <span style={{ position: "absolute", top: -8, left: -12, fontSize: 16, animation: "sparkFly 2s ease-out infinite 0.7s" }}>✦</span>
            <span style={{ position: "absolute", bottom: 0, right: 8, fontSize: 14, animation: "sparkFly 2s ease-out infinite 1.4s" }}>✦</span>
          </div>
          {/* Log lines */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Server Log</div>
            <div style={{ height: 8, width: 160, background: "#fee2e2", borderRadius: 4 }} />
            <div style={{ height: 8, width: 100, background: "#fee2e2", borderRadius: 4 }} />
            <div style={{ height: 8, width: 130, background: "#f3f4f6", borderRadius: 4 }} />
          </div>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", marginBottom: 12 }}>Kesalahan Internal Server</h1>
        <p style={{ fontSize: 15, color: "#6b7280", maxWidth: 440, lineHeight: 1.7, marginBottom: 36 }}>
          Terjadi sesuatu yang tidak beres di sisi server kami. Tim teknis kami sedang menangani masalah ini. Coba kembali beberapa saat lagi.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={reset} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#111827", color: "#fff", fontSize: 14, fontWeight: 600, padding: "12px 28px", borderRadius: 8, border: "none", cursor: "pointer" }}>
            <i className="fas fa-rotate-right" /> Coba Lagi
          </button>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#f3f4f6", color: "#374151", fontSize: 14, fontWeight: 600, padding: "12px 28px", borderRadius: 8, textDecoration: "none" }}>
            <i className="fas fa-arrow-left" /> Beranda
          </Link>
        </div>
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
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0.15} }
        @keyframes sparkFly { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-30px) scale(0.5)} }
      `}</style>
    </div>
  )
}
