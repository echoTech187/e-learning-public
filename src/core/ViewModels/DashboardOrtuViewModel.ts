export class DashboardOrtuViewModel {
  static async getDashboardData() {
    const childrenData = [
      { name: "Budi Santoso", program: "Bootcamp Web", progress: 64, avatar: "BS", color: "#4f46e5", bg: "#eef2ff", icon: "fas fa-laptop-code" },
      { name: "Siti Aminah", program: "UI/UX Design", progress: 38, avatar: "SA", color: "#db2777", bg: "#fdf2f8", icon: "fas fa-pen-nib" },
    ];
  
    const upcomingSchedules = [
      { title: "HTML Form & Validasi", time: "Hari ini, 15:00 WIB", child: "Budi Santoso", color: "#ef4444", bg: "#fef2f2" },
      { title: "Wireframing with Figma", time: "Besok, 10:00 WIB", child: "Siti Aminah", color: "#f59e0b", bg: "#fffbeb" },
      { title: "CSS Flexbox Dasar", time: "Jumat, 14:00 WIB", child: "Budi Santoso", color: "#3b82f6", bg: "#eff6ff" },
    ];
  
    const invoices = [
      { id: "INV-2026-001", amount: "Rp 500.000", desc: "SPP Okt - Budi", status: "Lunas", statusColor: "success" },
      { id: "INV-2026-002", amount: "Rp 750.000", desc: "Ujian - Siti", status: "Jatuh Tempo", statusColor: "danger" },
    ];

    const stats = {
      totalChildren: 2,
      classesThisWeek: 4,
      pendingInvoices: 1
    };

    return { childrenData, upcomingSchedules, invoices, stats };
  }
}
