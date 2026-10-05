import { cookies } from "next/headers";
import NotificationBell from "./NotificationBell";
import { DashboardProfessionalViewModel } from "@/core/ViewModels/DashboardProfessionalViewModel";

export default async function DashboardUmum() {
  const cookieStore = await cookies();
  const userStr = cookieStore.get("user")?.value;
  let userName = "Profesional";
  let userId = "";

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      userName = user.name.split(" ")[0];
      userId = user.id || "";
    } catch (e) {}
  }

  const { inProgress, recommendations } = await DashboardProfessionalViewModel.getDashboardData(userId);

  return (
    <div className="pb-5">
      <style>{`
        .elegant-card {
          background: white;
          border-radius: 1.5rem;
          border: 1px solid rgba(0,0,0,0.03) !important;
          box-shadow: 0 15px 40px -10px rgba(0,0,0,0.05) !important;
          transition: all 0.3s ease;
        }
        .elegant-card:hover { box-shadow: 0 20px 50px -10px rgba(0,0,0,0.08) !important; }
        
        .progress-card {
          border-radius: 1.25rem;
          background: white;
          border: 1px solid rgba(0,0,0,0.04);
          box-shadow: 0 8px 20px -5px rgba(0,0,0,0.03);
          transition: all 0.3s ease;
          overflow: hidden;
          position: relative;
        }
        .progress-card:hover { transform: translateY(-4px); box-shadow: 0 12px 25px -5px rgba(0,0,0,0.06); }
        .progress-card::after {
          content: ''; position: absolute; bottom: 0; left: 0; height: 4px; width: var(--progress);
          background: var(--card-color);
        }
        
        .course-card {
          border-radius: 1.25rem;
          border: 1px solid rgba(0,0,0,0.04);
          transition: all 0.3s ease;
          background: white;
          overflow: hidden;
        }
        .course-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px -5px rgba(0,0,0,0.08); }
        .course-img-placeholder {
          height: 140px; width: 100%;
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          display: flex; align-items: center; justify-content: center;
        }
        
        .btn-upgrade {
          background: linear-gradient(135deg, #0f172a, #1e293b);
          border: none; color: white; border-radius: 1rem;
          transition: all 0.3s ease;
        }
        .btn-upgrade:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(15,23,42,0.3); color: white; }
        
        .hero-professional {
          border-radius: 1.5rem;
          background: linear-gradient(135deg, #1e1b4b, #312e81);
          position: relative; overflow: hidden;
          box-shadow: 0 20px 40px -10px rgba(49,46,129,0.5);
        }
        .hero-professional::after {
          content: ''; position: absolute; top: 0; right: 0; bottom: 0; left: 50%;
          background: radial-gradient(circle at top right, rgba(99,102,241,0.4), transparent 70%);
        }
      `}</style>

      {/* TOP BAR */}
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between mb-4 gap-3">
        <div>
          <p className="mb-0 text-muted" style={{ fontSize: "0.9rem" }}>Dashboard Profesional,</p>
          <h2 className="fw-bold mb-0" style={{ color: "#0f172a", fontSize: "1.6rem", letterSpacing: "-0.5px" }}>
            Halo, {userName}!
          </h2>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="d-none d-xl-flex align-items-center gap-2 px-4 shadow-sm" style={{ height: "44px", borderRadius: "1rem", background: "white", border: "1px solid rgba(0,0,0,0.04)" }}>
            <i className="fas fa-search text-muted" style={{ fontSize: "0.85rem" }}></i>
            <input className="border-0 bg-transparent" style={{ fontSize: "0.85rem", width: "160px", color: "#64748b", outline: "none" }} placeholder="Cari skill baru..." />
          </div>
          <button className="btn btn-upgrade fw-semibold px-4 shadow-sm d-flex align-items-center gap-2" style={{ fontSize: "0.85rem", height: "44px" }}>
            <i className="fas fa-crown text-warning"></i> Upgrade Pro
          </button>
          <NotificationBell />
        </div>
      </div>

      {/* HERO BANNER PROFESIONAL */}
      <div className="hero-professional p-5 mb-5 d-flex align-items-center">
        <div className="position-relative z-1" style={{ maxWidth: "500px" }}>
          <span className="badge bg-white text-dark fw-bold px-3 py-2 mb-3 rounded-pill shadow-sm" style={{ fontSize: "0.75rem" }}>
            🎉 DISKON 30% HARI INI
          </span>
          <h3 className="fw-bold text-white mb-3" style={{ fontSize: "2rem", lineHeight: "1.2" }}>
            Tingkatkan Karir Anda dengan Skill Baru
          </h3>
          <p className="text-white text-opacity-75 mb-4" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
            Ratusan kelas bersertifikat industri menanti Anda. Belajar dari para ahli dan bangun portofolio profesional Anda sekarang.
          </p>
          <button className="btn fw-semibold px-4 py-2" style={{ background: "white", color: "#312e81", borderRadius: "1rem", fontSize: "0.95rem" }}>
            Jelajahi Kelas
          </button>
        </div>
      </div>

      {/* TWO COLUMNS LAYOUT */}
      <div className="row g-4">
        
        {/* LEFT COLUMN */}
        <div className="col-12 col-lg-8 d-flex flex-column gap-5">
          
          {/* Lanjutkan Belajar */}
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold text-dark mb-0">Lanjutkan Belajar</h5>
              <a href="#" className="text-primary text-decoration-none fw-semibold" style={{ fontSize: "0.85rem" }}>Semua Kursus</a>
            </div>
            <div className="row g-4">
              {inProgress.map((course, idx) => (
                <div key={idx} className="col-12 col-md-6">
                  <div className="progress-card p-4 h-100 d-flex flex-column" style={{ '--progress': `${course.progress}%`, '--card-color': course.color } as React.CSSProperties}>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0" style={{ width: "42px", height: "42px", background: course.color }}>
                        <i className="fas fa-play"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "0.95rem" }}>{course.title}</h6>
                        <div className="text-muted" style={{ fontSize: "0.75rem" }}>{course.progress}% Selesai</div>
                      </div>
                    </div>
                    <div className="mt-auto pt-3 border-top border-light d-flex justify-content-between align-items-center">
                      <span className="text-muted" style={{ fontSize: "0.8rem" }}>Modul: {course.lastLesson}</span>
                      <button className="btn btn-sm btn-light rounded-pill px-3" style={{ fontSize: "0.75rem", color: course.color, fontWeight: "600" }}>Lanjut</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rekomendasi Kelas */}
          <div>
            <h5 className="fw-bold text-dark mb-4">Rekomendasi Spesial Untuk Anda</h5>
            <div className="row g-4">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="col-12 col-md-4">
                  <div className="course-card h-100 d-flex flex-column">
                    <div className="course-img-placeholder position-relative">
                      <i className="fas fa-laptop-code text-muted opacity-25" style={{ fontSize: "3rem" }}></i>
                      <div className="position-absolute top-0 start-0 m-2">
                        <span className="badge px-2 py-1" style={{ background: "rgba(255,255,255,0.9)", color: rec.color, fontSize: "0.65rem", fontWeight: "700" }}>{rec.category}</span>
                      </div>
                    </div>
                    <div className="p-4 d-flex flex-column flex-grow-1">
                      <h6 className="fw-bold text-dark mb-2" style={{ fontSize: "0.95rem", lineHeight: "1.4" }}>{rec.title}</h6>
                      <div className="d-flex align-items-center gap-2 mb-3 mt-auto" style={{ fontSize: "0.75rem" }}>
                        <div className="text-warning"><i className="fas fa-star"></i> {rec.rating}</div>
                        <span className="text-muted">•</span>
                        <div className="text-muted"><i className="fas fa-user-graduate"></i> {rec.students}</div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center border-top pt-3">
                        <span className="fw-bold text-dark" style={{ fontSize: "0.9rem" }}>{rec.price}</span>
                        <button className="btn btn-sm px-3 rounded-pill" style={{ background: "#f1f5f9", color: "#475569", fontWeight: "600", fontSize: "0.75rem" }}>Detail</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="col-12 col-lg-4">
          <div className="d-flex flex-column gap-4 sticky-top" style={{ top: "1.5rem", zIndex: 10 }}>
            
            {/* Sertifikat Card */}
            <div className="elegant-card p-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #fef08a, #f59e0b)", color: "white", fontSize: "1.2rem" }}>
                  <i className="fas fa-award"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-dark">Sertifikat Anda</h6>
                  <div className="text-muted" style={{ fontSize: "0.8rem" }}>3 Sertifikat Profesional</div>
                </div>
              </div>
              <button className="btn w-100 fw-semibold shadow-sm" style={{ background: "#f8fafc", color: "#4f46e5", borderRadius: "1rem", border: "1px solid rgba(79,70,229,0.2)", fontSize: "0.85rem" }}>
                Lihat Semua Sertifikat
              </button>
            </div>

            {/* Target Belajar */}
            <div className="elegant-card p-4">
              <h6 className="fw-bold text-dark mb-4">Target Belajar Mingguan</h6>
              
              <div className="d-flex align-items-end gap-2 mb-2">
                <span className="fw-bold" style={{ fontSize: "2rem", lineHeight: "1", color: "#4f46e5" }}>8</span>
                <span className="text-muted fw-medium mb-1" style={{ fontSize: "0.85rem" }}>/ 12 Jam</span>
              </div>
              <div className="progress-bar-custom w-100 mb-3" style={{ height: "6px" }}>
                <div className="progress-fill" style={{ width: "66%", background: "#4f46e5" }}></div>
              </div>
              
              <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 mt-4" style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #dcfce7" }}>
                <i className="fas fa-fire"></i>
                <span style={{ fontSize: "0.8rem", fontWeight: "600" }}>3 Hari Berturut-turut!</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

