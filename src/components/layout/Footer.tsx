import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-edu">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <div className="brand-icon brand-icon-sm">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <span>EduNusa</span>
            </Link>
            <p>Platform e-learning terpercaya untuk generasi Indonesia yang ingin terus berkembang dan berprestasi.</p>
            <div className="footer-socials">
              <Link href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></Link>
              <Link href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></Link>
              <Link href="#" aria-label="TikTok"><i className="fab fa-tiktok"></i></Link>
              <Link href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></Link>
            </div>
          </div>
          <div className="footer-links">
            <h4>Platform</h4>
            <ul>
              <li><Link href="/kursus">Semua Kursus</Link></li>
              <li><Link href="/daftar">Daftar Gratis</Link></li>
              <li><Link href="/tentang-kami">Tentang Kami</Link></li>
              <li><Link href="#">Menjadi Instruktur</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Bantuan</h4>
            <ul>
              <li><Link href="/kontak">Hubungi Kami</Link></li>
              <li><Link href="#">FAQ</Link></li>
              <li><Link href="#">Kebijakan Privasi</Link></li>
              <li><Link href="#">Syarat & Ketentuan</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Kontak</h4>
            <ul>
              <li><i className="fas fa-envelope me-2"></i>info@edunusa.id</li>
              <li><i className="fas fa-phone me-2"></i>+62 811-2345-6789</li>
              <li><i className="fas fa-map-marker-alt me-2"></i>Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} EduNusa. Hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
