import { redirect } from "next/navigation"

async function getPlatformStatus() {
  try {
    const res = await fetch("http://admin/api/platform-status", {
      headers: { Host: "edunusa.console.edu.id" },
      cache: "no-store"
    })
    if (res.ok) return await res.json()
  } catch (error) {
    console.error("Maintenance Page API Error:", error)
  }
  return { is_suspended: 1 }
}

export default async function Maintenance() {
  const status = await getPlatformStatus()
  if (!status.is_suspended) redirect("/")

  return (
    <>
      <style>{`
        body { margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; background-color: #ffffff; color: #333333; display: flex; flex-direction: column; min-height: 100vh; }
        header { padding: 40px 0; text-align: center; }
        .logo { display: inline-flex; align-items: center; font-size: 22px; font-weight: 800; color: #000; text-decoration: none; letter-spacing: -0.03em; }
        .logo i { color: #0d6efd; margin-right: 8px; font-size: 24px; }
        main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0 20px; }
        h1 { font-size: 42px; font-weight: 800; color: #2b3035; margin: 0 0 16px; text-align: center; letter-spacing: -0.02em; }
        p.subtitle { font-size: 16px; color: #6c757d; text-align: center; max-width: 500px; margin: 0 0 80px; line-height: 1.6; }
        .illustration-container { width: 100%; max-width: 800px; height: 120px; position: relative; margin-bottom: 60px; display: flex; align-items: center; justify-content: center; }
        .plug-left { position: absolute; right: 52%; display: flex; align-items: center; animation: float-left 3s ease-in-out infinite alternate; }
        .wire-left { width: 250px; height: 12px; background: linear-gradient(90deg, transparent 0%, #93c5fd 100%); border-radius: 6px 0 0 6px; }
        .plug-body-left { width: 60px; height: 40px; background: #3b82f6; border-radius: 4px; position: relative; display: flex; align-items: center; justify-content: flex-end; }
        .plug-prongs { display: flex; flex-direction: column; gap: 12px; position: absolute; right: -16px; }
        .prong { width: 16px; height: 6px; background: #2563eb; border-radius: 0 3px 3px 0; }
        .plug-right { position: absolute; left: 52%; display: flex; align-items: center; animation: float-right 3s ease-in-out infinite alternate; }
        .plug-body-right { width: 60px; height: 56px; background: #10b981; border-radius: 6px; position: relative; display: flex; flex-direction: column; justify-content: center; gap: 8px; padding-left: 4px; }
        .socket-hole { width: 14px; height: 10px; background: #047857; border-radius: 2px; }
        .wire-right { width: 250px; height: 12px; background: linear-gradient(270deg, transparent 0%, #6ee7b7 100%); border-radius: 0 6px 6px 0; }
        @keyframes float-left  { 0%{transform:translateX(0) translateY(0)} 100%{transform:translateX(-10px) translateY(-2px)} }
        @keyframes float-right { 0%{transform:translateX(0) translateY(0)} 100%{transform:translateX(10px) translateY(2px)} }
        footer { border-top: 1px solid #e9ecef; padding: 30px 40px; display: flex; justify-content: space-between; align-items: center; color: #6c757d; font-size: 14px; }
        .footer-left span { margin-right: 20px; }
        .footer-left a { color: #6c757d; text-decoration: none; font-weight: 500; }
        .footer-left a:hover { color: #2b3035; }
        .social-icons { display: flex; gap: 12px; }
        .social-icons a { width: 32px; height: 32px; border: 1px solid #dee2e6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #adb5bd; text-decoration: none; transition: all 0.2s; font-size: 13px; }
        .social-icons a:hover { border-color: #6c757d; color: #6c757d; }
        @media (max-width: 768px) { h1 { font-size: 32px; } .wire-left, .wire-right { width: 100px; } footer { flex-direction: column; gap: 20px; text-align: center; } .footer-left span { display: block; margin: 5px 0; } }
      `}</style>

      <header>
        <span className="logo">
          <i className="fas fa-graduation-cap" /> EduNusa
        </span>
      </header>

      <main>
        <h1>Sistem sedang ditangguhkan<br />untuk pemeliharaan</h1>
        <p className="subtitle">
          Kami memohon maaf atas ketidaknyamanan ini.<br />
          Tim kami sedang melakukan perbaikan dan sistem akan segera kembali.
        </p>
        <div className="illustration-container">
          <div className="plug-left">
            <div className="wire-left" />
            <div className="plug-body-left">
              <div className="plug-prongs"><div className="prong" /><div className="prong" /></div>
            </div>
          </div>
          <div className="plug-right">
            <div className="plug-body-right">
              <div className="socket-hole" /><div className="socket-hole" />
            </div>
            <div className="wire-right" />
          </div>
        </div>
      </main>

      <footer>
        <div className="footer-left">
          <span>You can contact us:</span>
          <span>Phone: +62 812-3456-7890</span>
          <span>Email: <a href="mailto:support@edunusa.edu.id">support@edunusa.edu.id</a></span>
        </div>
        <div className="social-icons">
          <a href="#"><i className="fab fa-facebook-f" /></a>
          <a href="#"><i className="fab fa-twitter" /></a>
          <a href="#"><i className="fab fa-instagram" /></a>
          <a href="#"><i className="fab fa-telegram-plane" /></a>
        </div>
      </footer>
    </>
  )
}
