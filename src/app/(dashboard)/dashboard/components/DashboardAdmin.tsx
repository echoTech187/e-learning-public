import { DashboardAdminViewModel } from "@/core/ViewModels/DashboardAdminViewModel";

export default async function DashboardAdmin() {
  const { systemStatus, revenue, recentUsers } = await DashboardAdminViewModel.getDashboardData();
  return (
    <div className="container-fluid py-4" style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <p className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>Control Panel,</p>
          <h3 className="fw-bold text-dark mb-0">Admin Dashboard ⚙️</h3>
        </div>
        <div className="d-flex gap-3">
          <button className="btn btn-dark rounded-pill px-4" style={{ fontWeight: "600" }}>
            <i className="fas fa-plus me-2"></i> Tambah Pengguna
          </button>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* System Status Hero */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 p-4 h-100" style={{ borderRadius: "1.5rem", background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", color: "white", boxShadow: "0 20px 25px -5px rgba(15, 23, 42, 0.4)" }}>
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h4 className="fw-bold mb-1">Status Sistem</h4>
                <p className="text-white-50 mb-0" style={{ fontSize: "0.9rem" }}>{systemStatus.message}</p>
              </div>
              <div className="bg-success text-white rounded-pill px-3 py-1" style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                <i className="fas fa-check-circle me-1"></i> {systemStatus.status}
              </div>
            </div>
            
            <div className="row g-4 mt-2">
              <div className="col-4">
                <div className="p-3 rounded-4" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="text-white-50 mb-1" style={{ fontSize: "0.8rem", fontWeight: "600" }}>CPU USAGE</div>
                  <h3 className="fw-bold mb-0 text-white">{systemStatus.cpuUsage}</h3>
                </div>
              </div>
              <div className="col-4">
                <div className="p-3 rounded-4" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="text-white-50 mb-1" style={{ fontSize: "0.8rem", fontWeight: "600" }}>MEMORY</div>
                  <h3 className="fw-bold mb-0 text-white">{systemStatus.memory}</h3>
                </div>
              </div>
              <div className="col-4">
                <div className="p-3 rounded-4" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="text-white-50 mb-1" style={{ fontSize: "0.8rem", fontWeight: "600" }}>ACTIVE USERS</div>
                  <h3 className="fw-bold mb-0 text-white">{systemStatus.activeUsers}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Revenue/Growth */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 p-4 h-100" style={{ borderRadius: "1.5rem", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}>
            <div className="d-flex align-items-center mb-4">
              <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "48px", height: "48px", fontSize: "1.2rem" }}>
                <i className="fas fa-chart-line"></i>
              </div>
              <div>
                <h5 className="fw-bold mb-0 text-dark">Pendapatan Bulan Ini</h5>
              </div>
            </div>
            <h2 className="fw-bold text-dark mb-1">{revenue.currentMonth}</h2>
            <p className="text-success fw-bold mb-0" style={{ fontSize: "0.9rem" }}><i className="fas fa-arrow-up me-1"></i> {revenue.growth}</p>
          </div>
        </div>
      </div>
      
      {/* Recent Users Table */}
      <div className="card border-0 p-0 overflow-hidden" style={{ borderRadius: "1.5rem", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}>
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0 text-dark">Pendaftaran Terakhir</h5>
          <button className="btn btn-sm btn-light rounded-pill px-3" style={{ fontWeight: "600" }}>Lihat Semua</button>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3 text-muted" style={{ fontSize: "0.8rem", fontWeight: "600", letterSpacing: "0.5px" }}>USER</th>
                <th className="py-3 text-muted" style={{ fontSize: "0.8rem", fontWeight: "600", letterSpacing: "0.5px" }}>ROLE</th>
                <th className="py-3 text-muted" style={{ fontSize: "0.8rem", fontWeight: "600", letterSpacing: "0.5px" }}>STATUS</th>
                <th className="py-3 text-muted" style={{ fontSize: "0.8rem", fontWeight: "600", letterSpacing: "0.5px" }}>TANGGAL</th>
                <th className="px-4 py-3 text-end text-muted" style={{ fontSize: "0.8rem", fontWeight: "600", letterSpacing: "0.5px" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: "36px", height: "36px", fontSize: "0.9rem" }}>{row.name.charAt(0)}</div>
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: "0.9rem" }}>{row.name}</div>
                        <div className="text-muted" style={{ fontSize: "0.8rem" }}>{row.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3"><span className="badge bg-light text-dark border px-2 py-1">{row.role}</span></td>
                  <td className="py-3"><span className={`badge bg-${row.statusColor} bg-opacity-10 text-${row.statusColor} px-2 py-1`}>{row.status}</span></td>
                  <td className="py-3 text-muted" style={{ fontSize: "0.85rem" }}>{row.date}</td>
                  <td className="px-4 py-3 text-end">
                    <button className="btn btn-sm btn-light rounded-circle" style={{ width: "32px", height: "32px" }}><i className="fas fa-ellipsis-v"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

