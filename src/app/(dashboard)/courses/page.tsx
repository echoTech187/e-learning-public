import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DashboardStudentViewModel } from "@/core/ViewModels/DashboardStudentViewModel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kursus Saya | EduNusa",
};

export default async function MyCoursesPage() {
  const cookieStore = await cookies();
  const userStr = cookieStore.get("user")?.value;
  const token = cookieStore.get("token")?.value;

  if (!token || !userStr) {
    redirect("/masuk");
  }

  let userId = "";
  let userName = "";
  try {
    const user = JSON.parse(userStr);
    userId = user.id;
    userName = user.name;
  } catch (e) {
    redirect("/masuk");
  }

  // Ambil data kursus yang diikuti user
  const uiData = await DashboardStudentViewModel.getDashboardData(userId);
  const courses = uiData.activeCourses;

  return (
    <div>
      <style>{`
        .course-card {
          background: #ffffff;
          border-radius: 1.25rem;
          border: 1px solid rgba(0,0,0,0.04);
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .course-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1);
        }
        .course-thumbnail {
          height: 180px;
          position: relative;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .course-thumbnail::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%);
        }
        .course-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .course-icon-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          z-index: 2;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .progress-bar-custom {
          height: 6px;
          border-radius: 99px;
          background: #e2e8f0;
          overflow: hidden;
          margin-top: 12px;
        }
        .progress-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 0.8s ease;
        }
        .btn-lanjutkan {
          background: linear-gradient(135deg, #6c47ff, #8b5cf6);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 10px 20px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          width: 100%;
          display: inline-block;
          text-align: center;
          text-decoration: none;
        }
        .btn-lanjutkan:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 15px rgba(108, 71, 255, 0.25);
          color: white;
        }
      `}</style>

      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}>Kursus Saya</h2>
          <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>Lanjutkan pembelajaranmu dan capai targetmu, {userName.split(" ")[0]}!</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-5" style={{ background: "#f8fafc", borderRadius: "1.5rem", border: "1px dashed #cbd5e1" }}>
          <div className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle mb-3 shadow-sm" style={{ width: "80px", height: "80px" }}>
            <i className="fas fa-book-open text-muted" style={{ fontSize: "2rem" }}></i>
          </div>
          <h4 className="fw-bold text-dark">Belum ada kursus</h4>
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: "400px" }}>
            Kamu belum terdaftar di kursus apapun. Yuk eksplorasi katalog dan mulai belajar sekarang!
          </p>
          <Link href="/kursus" className="btn btn-primary px-4 py-2" style={{ borderRadius: "10px", fontWeight: 600 }}>
            <i className="fas fa-search me-2"></i>Cari Kursus
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {courses.map((course) => {
            // Menggunakan nilai progres aktual dari database
            const progress = course.progress || 0; 
            
            return (
              <div key={course.id} className="col-12 col-md-6 col-xl-4">
                <div className="course-card">
                  <div className="course-thumbnail">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.name} />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: `linear-gradient(135deg, ${course.color}20, ${course.color}10)` }}>
                        <i className={course.icon} style={{ fontSize: "4rem", color: course.color, opacity: 0.5 }}></i>
                      </div>
                    )}
                    <div className="course-icon-badge" style={{ color: course.color }}>
                      <i className={course.icon}></i>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-grow-1 d-flex flex-column">
                    <div className="badge mb-2 align-self-start" style={{ background: `${course.color}15`, color: course.color, padding: "6px 12px", borderRadius: "6px", fontWeight: 600, fontSize: "0.75rem" }}>
                      Sedang Dipelajari
                    </div>
                    <h5 className="fw-bold text-dark mb-2" style={{ fontSize: "1.1rem", lineHeight: "1.4" }}>
                      {course.name}
                    </h5>
                    
                    <div className="mt-auto pt-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="text-muted fw-semibold" style={{ fontSize: "0.8rem" }}>Progres</span>
                        <span className="fw-bold" style={{ fontSize: "0.8rem", color: course.color }}>{progress}%</span>
                      </div>
                      <div className="progress-bar-custom mb-4">
                        <div className="progress-fill" style={{ width: `${progress}%`, background: course.color }}></div>
                      </div>
                      
                      <Link href={`/class-room/${course.slug}`} className="btn-lanjutkan">
                        <i className="fas fa-play-circle me-2"></i> Lanjutkan Belajar
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
