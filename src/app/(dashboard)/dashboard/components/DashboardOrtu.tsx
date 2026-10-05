import { cookies } from "next/headers";
import NotificationBell from "./NotificationBell";
import { DashboardOrtuViewModel } from "@/core/ViewModels/DashboardOrtuViewModel";

export default async function DashboardOrtu() {
  const cookieStore = await cookies();
  const userStr = cookieStore.get("user")?.value;
  let userName = "Bapak/Ibu";

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      userName = user.name.split(" ")[0];
    } catch (e) {}
  }

  const { childrenData, upcomingSchedules, invoices, stats } = await DashboardOrtuViewModel.getDashboardData();

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
        
        .stat-card-premium {
          border-radius: 1.25rem;
          background: linear-gradient(145deg, #ffffff, #f8fafc);
          border: 1px solid rgba(0,0,0,0.04);
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.04);
          transition: all 0.3s ease;
        }
        .stat-card-premium:hover { transform: translateY(-5px); box-shadow: 0 15px 35px -5px rgba(0,0,0,0.08); }
        
        .child-card {
          border-radius: 1.25rem;
          background: white;
          border: 1px solid rgba(0,0,0,0.04);
          box-shadow: 0 8px 20px -5px rgba(0,0,0,0.03);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .child-card:hover { transform: translateY(-4px); box-shadow: 0 12px 25px -5px rgba(0,0,0,0.06); border-color: rgba(79,70,229,0.2); }
        .child-card::before {
          content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%;
          background: var(--card-color);
        }
        
        .progress-bar-custom { height: 6px; border-radius: 3px; background: #e2e8f0; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 3px; transition: width 1s ease-in-out; }
        
        .list-item-hover { transition: all 0.2s ease; border-radius: 1rem; }
        .list-item-hover:hover { background: #f8fafc; transform: translateX(4px); }
        
        .btn-booking {
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          border: none;
          color: white;
          border-radius: 1rem;
          transition: all 0.3s ease;
        }
        .btn-booking:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(79,70,229,0.3); color: white; }
      `}</style>

      {/* GREETING */}
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between mb-4 pb-2 gap-3">
        <div>
          <p className="mb-1 text-muted" style={{ fontSize: "0.95rem" }}>Portal Orang Tua,</p>
          <h2 className="fw-bold mb-0" style={{ color: "#0f172a", fontSize: "1.8rem", letterSpacing: "-0.5px" }}>
            Selamat datang, {userName}!
          </h2>
        </div>
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-booking fw-semibold px-4 py-2 d-flex align-items-center gap-2 shadow-sm">
            <i className="fas fa-plus-circle"></i> Booking Kelas Baru
          </button>
          <NotificationBell />
        </div>
      </div>

      {/* STATISTIK TOP */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-md-4">
          <div className="stat-card-premium p-4 h-100 d-flex align-items-center gap-4">
            <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm" style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, #e0e7ff, #c7d2fe)", color: "#4f46e5", fontSize: "1.5rem" }}>
              <i className="fas fa-child"></i>
            </div>
            <div>
              <div className="text-muted fw-medium mb-1" style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Anak Terdaftar</div>
              <div className="fw-bold text-dark" style={{ fontSize: "1.8rem", lineHeight: "1" }}>{stats.totalChildren}</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="stat-card-premium p-4 h-100 d-flex align-items-center gap-4">
            <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm" style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, #d1fae5, #a7f3d0)", color: "#059669", fontSize: "1.5rem" }}>
              <i className="fas fa-chalkboard-teacher"></i>
            </div>
            <div>
              <div className="text-muted fw-medium mb-1" style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Kelas Minggu Ini</div>
              <div className="fw-bold text-dark" style={{ fontSize: "1.8rem", lineHeight: "1" }}>{stats.classesThisWeek}</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="stat-card-premium p-4 h-100 d-flex align-items-center gap-4">
            <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm" style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, #fee2e2, #fecaca)", color: "#dc2626", fontSize: "1.5rem" }}>
              <i className="fas fa-file-invoice-dollar"></i>
            </div>
            <div>
              <div className="text-muted fw-medium mb-1" style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Tagihan Tertunda</div>
              <div className="fw-bold text-dark" style={{ fontSize: "1.8rem", lineHeight: "1" }}>{stats.pendingInvoices}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ANAK SAYA */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold text-dark mb-0">Perkembangan Anak</h5>
        <button className="btn btn-light fw-semibold text-primary px-4 py-2 border-0 shadow-sm" style={{ borderRadius: "1rem", fontSize: "0.85rem", background: "white" }}>
          Kelola Anak <i className="fas fa-arrow-right ms-1"></i>
        </button>
      </div>
      <div className="row g-4 mb-5">
        {childrenData.map((child, idx) => (
          <div key={idx} className="col-12 col-lg-6">
            <div className="child-card p-4 d-flex align-items-center gap-4" style={{ '--card-color': child.color } as React.CSSProperties}>
              <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-4 flex-shrink-0 shadow-sm" style={{ width: "64px", height: "64px", background: `linear-gradient(135deg, ${child.color}, ${child.color}dd)` }}>
                {child.avatar}
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <h5 className="fw-bold mb-0 text-dark">{child.name}</h5>
                  <span className="badge rounded-pill fw-medium px-3 py-1" style={{ background: child.bg, color: child.color, fontSize: "0.75rem" }}>
                    <i className={`${child.icon} me-1`}></i> {child.program}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-end mt-3 mb-2">
                  <span className="text-muted fw-medium" style={{ fontSize: "0.8rem" }}>Progres Pembelajaran</span>
                  <span className="fw-bold" style={{ color: child.color, fontSize: "0.9rem" }}>{child.progress}%</span>
                </div>
                <div className="progress-bar-custom w-100">
                  <div className="progress-fill" style={{ width: `${child.progress}%`, background: child.color }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TWO COLUMNS: JADWAL & TAGIHAN */}
      <div className="row g-4">
        {/* Jadwal Terdekat */}
        <div className="col-12 col-lg-7">
          <div className="elegant-card h-100">
            <div className="px-4 pt-4 pb-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="fw-bold text-dark mb-0">Jadwal Kelas Terdekat</h5>
              <a href="#" className="text-primary text-decoration-none fw-semibold" style={{ fontSize: "0.85rem" }}>Lihat Kalender</a>
            </div>
            <div className="p-3">
              {upcomingSchedules.map((schedule, i) => (
                <div key={i} className="list-item-hover d-flex align-items-center gap-3 px-3 py-3 border-bottom border-light">
                  <div className="rounded-4 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "48px", height: "48px", background: schedule.bg, color: schedule.color, fontSize: "1.2rem" }}>
                    <i className="far fa-calendar-alt"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold text-dark mb-1" style={{ fontSize: "0.95rem" }}>{schedule.title}</div>
                    <div className="text-muted d-flex align-items-center gap-2" style={{ fontSize: "0.8rem" }}>
                      <span><i className="far fa-clock"></i> {schedule.time}</span>
                    </div>
                  </div>
                  <div className="text-end flex-shrink-0">
                    <div className="badge fw-medium px-3 py-2 rounded-pill shadow-sm border border-light" style={{ fontSize: "0.75rem", background: "white", color: "#475569" }}>
                      <i className="far fa-user me-1 text-muted"></i> {schedule.child}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ringkasan Tagihan */}
        <div className="col-12 col-lg-5">
          <div className="elegant-card h-100 d-flex flex-column">
            <div className="px-4 pt-4 pb-3 border-bottom">
              <h5 className="fw-bold text-dark mb-0">Ringkasan Tagihan</h5>
            </div>
            <div className="p-3 flex-grow-1">
              {invoices.map((inv, i) => (
                <div key={i} className="list-item-hover d-flex align-items-center gap-3 px-3 py-3 border-bottom border-light">
                  <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "40px", height: "40px", background: "#f1f5f9", color: "#64748b" }}>
                    <i className="fas fa-receipt"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold text-dark mb-1" style={{ fontSize: "0.95rem" }}>{inv.amount}</div>
                    <div className="text-muted" style={{ fontSize: "0.8rem" }}>{inv.desc}</div>
                  </div>
                  <div className="text-end">
                    <span className={`badge rounded-pill px-3 py-2 bg-${inv.statusColor} bg-opacity-10 text-${inv.statusColor}`} style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                      {inv.status}
                    </span>
                    <div className="text-muted mt-1" style={{ fontSize: "0.7rem" }}>{inv.id}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-top mt-auto bg-light" style={{ borderBottomLeftRadius: "1.5rem", borderBottomRightRadius: "1.5rem" }}>
              <button className="btn fw-semibold w-100 py-2 shadow-sm" style={{ fontSize: "0.9rem", background: "white", color: "#4f46e5", borderRadius: "1rem", border: "1px solid rgba(79,70,229,0.2)" }}>
                Lihat Semua Pembayaran <i className="fas fa-chevron-right ms-1" style={{ fontSize: "0.75rem" }}></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

