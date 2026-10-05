import { DashboardMentorViewModel } from "@/core/ViewModels/DashboardMentorViewModel";

export default async function DashboardMentor() {
  const { liveClass, stats } = await DashboardMentorViewModel.getDashboardData();
  return (
    <div className="container-fluid py-4" style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <p className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>Dashboard Mentor,</p>
          <h3 className="fw-bold text-dark mb-0">Halo, Mentor! 👋</h3>
        </div>
        <div className="d-flex gap-3">
          <button className="btn btn-light rounded-pill px-4 border" style={{ fontWeight: "600" }}>
            <i className="fas fa-video me-2 text-primary"></i> Buat Kelas Live
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="card border-0 mb-4 position-relative overflow-hidden" style={{ borderRadius: "1.5rem", background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)", minHeight: "220px", boxShadow: "0 20px 25px -5px rgba(79, 70, 229, 0.3)" }}>
        <div className="card-body p-5 position-relative" style={{ zIndex: 2 }}>
          <div className="d-inline-block bg-white text-primary rounded-pill px-3 py-1 mb-3" style={{ fontSize: "0.8rem", fontWeight: "700" }}>
            <span className="text-danger me-2">●</span> SEDANG BERLANGSUNG
          </div>
          <h2 className="text-white fw-bold mb-3" style={{ fontSize: "2rem", letterSpacing: "-0.5px", maxWidth: "60%" }}>{liveClass.title}</h2>
          <div className="d-flex gap-4 text-white-50 mb-4" style={{ fontSize: "0.9rem", fontWeight: "500" }}>
            <span><i className="far fa-clock me-2"></i> {liveClass.time}</span>
            <span><i className="far fa-user me-2"></i> {liveClass.activeStudents} Peserta Aktif</span>
          </div>
          <button className="btn btn-dark rounded-pill px-4 py-2" style={{ fontWeight: "600", transition: "transform 0.2s" }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            Masuk ke Ruang Kelas <i className="fas fa-arrow-right ms-2"></i>
          </button>
        </div>
        <div className="position-absolute" style={{ right: "-20px", bottom: "-40px", width: "400px", opacity: "0.2" }}>
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ffffff" d="M45.7,-76.3C58.9,-69.3,69.1,-55.3,77.3,-41C85.5,-26.7,91.8,-13.3,92.5,0.4C93.2,14.1,88.3,28.2,80.1,40.8C71.9,53.4,60.3,64.4,47.1,72.4C33.9,80.4,19.1,85.4,4.4,77.7C-10.3,69.9,-20.6,49.4,-34.5,41.4C-48.4,33.4,-65.9,37.9,-75.4,28.6C-84.9,19.3,-86.4,-3.8,-82.1,-24.1C-77.8,-44.4,-67.6,-61.9,-53.4,-68.8C-39.2,-75.7,-21,-71.9,-4.3,-64.7C12.4,-57.5,24.8,-47.1,34.4,-44.1L45.7,-76.3Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Quick Stats */}
        <div className="col-12 col-md-3">
          <div className="card border-0 p-4 h-100" style={{ borderRadius: "1.5rem", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}>
            <div className="d-flex align-items-center mb-3">
              <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px", fontSize: "1.2rem" }}>
                <i className="fas fa-users"></i>
              </div>
            </div>
            <h3 className="fw-bold mb-1">{stats.totalStudents}</h3>
            <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>Total Murid Aktif</p>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card border-0 p-4 h-100" style={{ borderRadius: "1.5rem", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}>
            <div className="d-flex align-items-center mb-3">
              <div className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px", fontSize: "1.2rem" }}>
                <i className="fas fa-star"></i>
              </div>
            </div>
            <h3 className="fw-bold mb-1">{stats.averageRating}</h3>
            <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>Rating Rata-rata</p>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card border-0 p-4 h-100" style={{ borderRadius: "1.5rem", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}>
            <div className="d-flex align-items-center mb-3">
              <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px", fontSize: "1.2rem" }}>
                <i className="fas fa-check-circle"></i>
              </div>
            </div>
            <h3 className="fw-bold mb-1">{stats.pendingTasks}</h3>
            <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>Tugas Perlu Dinilai</p>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card border-0 p-4 h-100" style={{ borderRadius: "1.5rem", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}>
            <div className="d-flex align-items-center mb-3">
              <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px", fontSize: "1.2rem" }}>
                <i className="fas fa-comment-dots"></i>
              </div>
            </div>
            <h3 className="fw-bold mb-1">{stats.unreadMessages}</h3>
            <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>Pesan Belum Dibaca</p>
          </div>
        </div>
      </div>
    </div>
  );
}

