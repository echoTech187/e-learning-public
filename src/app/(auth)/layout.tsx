import Link from "next/link";
import "../../globals.css"; // Ensure styles are loaded

export const metadata = {
  title: "E-Learning Platform",
  description: "Platform e-learning terbaik Indonesia",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-body">
      <div className="auth-wrapper">
        <div className="auth-left d-none d-lg-flex">
          <div className="auth-left-content">
            <Link href="/" className="auth-brand text-decoration-none">
              <div className="brand-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <span className="brand-name">EduNusa</span>
            </Link>
            <div className="auth-illustration">
              <div className="illustration-circle circle-1"></div>
              <div className="illustration-circle circle-2"></div>
              <div className="illustration-circle circle-3"></div>

              <div className="floating-card card-1">
                <i className="fas fa-video"></i>
                <span>1,200+ Video Kursus</span>
              </div>
              <div className="floating-card card-2">
                <i className="fas fa-users"></i>
                <span>50,000+ Siswa Aktif</span>
              </div>
              <div className="floating-card card-3">
                <i className="fas fa-certificate"></i>
                <span>Sertifikat Terakreditasi</span>
              </div>

              <div className="hero-text">
                <h2>Wujudkan Impian<br/>Karier Anda</h2>
                <p>Belajar dari instruktur terbaik, raih sertifikat profesional, dan tingkatkan kariermu bersama EduNusa.</p>
              </div>
            </div>
            <div className="auth-testimonial">
              <div className="testimonial-avatar">
                <div className="avatar-placeholder">RN</div>
              </div>
              <div className="testimonial-content">
                <p>&quot;EduNusa membantu saya mendapat pekerjaan impian sebagai developer!&quot;</p>
                <strong>Reza Nugraha</strong> — Frontend Developer
              </div>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-container">
            <Link href="/" className="d-lg-none auth-brand-mobile text-decoration-none">
              <div className="brand-icon brand-icon-sm">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <span className="brand-name">EduNusa</span>
            </Link>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
