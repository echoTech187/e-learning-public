import { cookies } from "next/headers";
import Link from "next/link";
import HeroSlider from "./HeroSlider";
import NotificationBell from "./NotificationBell";
import ChatMentorWidget from "@/components/ChatMentorWidget";
import { DashboardStudentViewModel } from "@/core/ViewModels/DashboardStudentViewModel";

export default async function DashboardMurid() {
  const cookieStore = await cookies();
  const userStr = cookieStore.get("user")?.value;
  let userName = "Siswa";
  let userId = "";

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      userName = user.name ? user.name.split(" ")[0] : "Siswa";
      userId = user.id || "";
    } catch (e) {}
  }

  // Fetch Real Data from ViewModel
  const uiData = await DashboardStudentViewModel.getDashboardData(userId);
  const courses = uiData.activeCourses;
  const paths = uiData.learningPaths;
  const tugas = uiData.pendingTasks;

  return (
    <div>
      <style>{`
        .course-item { transition: all 0.3s ease; cursor: pointer; border-radius: 1rem; }
        .course-item:hover { background: #f8fafc; transform: translateX(4px); }
        .search-input:focus { outline: none; }
        
        .elegant-card {
          background: white;
          border-radius: 1.5rem;
          border: 1px solid rgba(0,0,0,0.03) !important;
          box-shadow: 0 15px 40px -10px rgba(0,0,0,0.05) !important;
          transition: all 0.3s ease;
        }
        .elegant-card:hover {
          box-shadow: 0 20px 50px -10px rgba(0,0,0,0.08) !important;
        }
        .elegant-btn {
          border-radius: 1rem !important;
          border: 1px solid rgba(0,0,0,0.04) !important;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03) !important;
          transition: all 0.2s ease;
          background: white;
        }
        .elegant-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.06) !important;
        }
        .path-card {
          border-radius: 1.25rem;
          border: 1px solid rgba(0,0,0,0.02);
          box-shadow: 0 8px 20px -5px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }
        .path-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 25px -5px rgba(0,0,0,0.08);
        }
      `}</style>

      {/* === TOP ROW: Greeting + Search + Bell + Sertifikat === */}
      {/* 1. DESKTOP VIEW (>= lg) */}
      <div className="d-none d-lg-flex align-items-center justify-content-between mb-4 gap-3">
        <div>
          <p className="mb-0 text-muted" style={{ fontSize: "0.9rem" }}>Selamat datang kembali,</p>
          <h2 className="fw-bold mb-0" style={{ color: "#0f172a", fontSize: "1.65rem", letterSpacing: "-0.02em" }}>
            Halo, {userName}! 👋
          </h2>
        </div>
        <div className="d-flex align-items-center gap-3">
          <Link href="/murid/sertifikat" className="btn elegant-btn fw-semibold text-dark px-4 d-flex align-items-center text-decoration-none" style={{ fontSize: "0.85rem", height: "44px" }}>
            <i className="fas fa-award text-warning me-2"></i> Lihat Sertifikat
          </Link>
          <div className="d-flex align-items-center gap-2 elegant-btn px-4" style={{ height: "44px" }}>
            <i className="fas fa-search text-muted" style={{ fontSize: "0.85rem" }}></i>
            <input className="border-0 bg-transparent search-input" style={{ fontSize: "0.85rem", width: "160px", color: "#64748b" }} placeholder="Cari kursus..." />
          </div>
          <NotificationBell />
        </div>
      </div>

      {/* 2. MOBILE VIEW (< lg): Perfectly structured & tidy */}
      <div className="d-lg-none mb-4">
        {/* Line 1: Greeting on Left, Bell on Right */}
        <div className="d-flex align-items-start justify-content-between gap-2">
          <div>
            <span className="text-muted" style={{ fontSize: "0.85rem", fontWeight: 500 }}>Selamat datang kembali,</span>
            <h2 className="fw-bold mb-0 text-dark" style={{ fontSize: "1.45rem", letterSpacing: "-0.02em" }}>
              Halo, {userName}! 👋
            </h2>
          </div>
          <div className="flex-shrink-0">
            <NotificationBell />
          </div>
        </div>

        {/* Line 2: Full-width Certificate Button */}
        <div className="mt-3">
          <Link
            href="/murid/sertifikat"
            className="btn elegant-btn w-100 d-flex align-items-center justify-content-between px-3 py-2 text-dark text-decoration-none fw-semibold shadow-xs"
            style={{ height: "46px", borderRadius: "12px", border: "1px solid #e2e8f0" }}
          >
            <span className="d-flex align-items-center gap-2" style={{ fontSize: "0.88rem" }}>
              <i className="fas fa-award text-warning" style={{ fontSize: "1.1rem" }}></i>
              <span>Lihat Sertifikat Saya</span>
            </span>
            <i className="fas fa-arrow-right text-muted" style={{ fontSize: "0.75rem" }}></i>
          </Link>
        </div>
      </div>

      {/* === 2-COLUMN LAYOUT === */}
      <div className="row g-4 mb-4">
        {/* LEFT COLUMN: Main Stream */}
        <div className="col-12 col-lg-8 d-flex flex-column gap-4">
          <HeroSlider />

          {/* Jalur Belajarmu */}
          <div className="elegant-card p-4 w-100">
            <h6 className="fw-bold text-dark mb-4" style={{ fontSize: "1rem" }}>Jalur Belajarmu</h6>
            <div className="row g-3">
              {paths.map((c, i) => (
                <div key={i} className="col-12 col-md-4">
                  <div className="path-card p-4 h-100" style={{ background: c.color }}>
                    <div className="fw-bold mb-1" style={{ color: c.text, fontSize: "0.95rem" }}>{c.title}</div>
                    <div className="text-muted mb-3" style={{ fontSize: "0.75rem" }}>{c.hours}</div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex">
                        {["A","B","C"].map((l, j) => (
                          <div key={j} className="rounded-circle bg-white d-flex align-items-center justify-content-center fw-bold" style={{ width: "26px", height: "26px", fontSize: "0.65rem", border: "2px solid white", marginLeft: j === 0 ? "0" : "-8px", color: "#64748b" }}>
                            {l}
                          </div>
                        ))}
                      </div>
                      <i className="fas fa-star" style={{ color: "#f59e0b", fontSize: "0.9rem" }}></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kursus Berlangsung */}
          <div className="elegant-card w-100">
            <div className="px-4 pt-4 pb-2">
              <h6 className="fw-bold text-dark mb-0" style={{ fontSize: "1rem" }}>Kursus Berlangsung</h6>
            </div>
            <div className="p-2">
              {courses.map((item, i) => (
                <Link href={`/class-room/${item.slug}`} key={i} className="text-decoration-none">
                  <div className="course-item d-flex align-items-center gap-3 px-3 py-3 rounded-3" style={{ cursor: "pointer" }}>
                    <div className="rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0" style={{ width: "42px", height: "42px", background: item.color, fontSize: "1.1rem" }}>
                      <i className={item.icon}></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold text-dark" style={{ fontSize: "0.9rem" }}>{item.name}</div>
                      <div className="text-muted" style={{ fontSize: "0.8rem" }}>{item.sub}</div>
                    </div>
                    <i className="fas fa-chevron-right text-muted" style={{ fontSize: "0.8rem" }}></i>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Tugas Menunggu */}
          <div className="elegant-card w-100">
            <div className="px-4 pt-4 pb-2 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold text-dark mb-0" style={{ fontSize: "1rem" }}>Tugas Menunggu</h6>
              <Link href="/murid/tugas" className="text-primary text-decoration-none fw-semibold" style={{ fontSize: "0.85rem" }}>Semua</Link>
            </div>
            <div className="p-2">
              {tugas.map((item, i) => (
                <div key={i} className="course-item d-flex align-items-center gap-3 px-3 py-3 rounded-3" style={{ cursor: "pointer" }}>
                  <div className="rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0" style={{ width: "38px", height: "38px", background: item.color, fontSize: "1rem" }}>
                    <i className={item.icon}></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold text-dark" style={{ fontSize: "0.85rem" }}>{item.name}</div>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grafik Nilai Rata-Rata */}
          <div className="elegant-card p-4 w-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="fw-bold text-dark mb-0" style={{ fontSize: "1rem" }}>Grafik Nilai Rata-Rata</h6>
              <span className="badge fw-semibold px-3 py-2 rounded-pill" style={{ fontSize: "0.75rem", background: "#e0e7ff", color: "#4f46e5" }}>Bulan Ini</span>
            </div>

            <svg viewBox="0 0 300 120" style={{ width: "100%", overflow: "visible" }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M 0 90 C 40 85, 60 50, 100 55 S 160 80, 200 40 S 260 20, 300 45" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M 0 90 C 40 85, 60 50, 100 55 S 160 80, 200 40 S 260 20, 300 45 L 300 120 L 0 120 Z" fill="url(#chartGrad)"/>
              <circle cx="200" cy="40" r="5" fill="#6366f1"/>
              <rect x="165" y="18" width="45" height="18" rx="6" fill="#6366f1"/>
              <text x="187" y="31" fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">85</text>
            </svg>

            <div className="d-flex justify-content-between mt-1 text-muted" style={{ fontSize: "0.75rem" }}>
              <span>Okt</span><span>Mar</span><span>Jul</span><span>Agu</span>
            </div>

            <div className="mt-4 pt-3 border-top d-flex align-items-center gap-2">
              <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px" }}>
                <i className="fas fa-arrow-up" style={{ fontSize: "0.85rem" }}></i>
              </div>
              <span className="fw-bold text-dark fs-5">Sangat Baik</span>
              <span className="text-muted ms-auto" style={{ fontSize: "0.8rem" }}>naik 5 poin</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Chat Mentor (Inline on desktop, Floating Action Button on mobile) */}
        <div className="col-12 col-lg-4">
          <ChatMentorWidget />
        </div>
      </div>
    </div>
  );
}

