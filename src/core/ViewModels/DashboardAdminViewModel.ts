export class DashboardAdminViewModel {
  static async getDashboardData() {
    const systemStatus = {
      status: "ONLINE",
      message: "Semua layanan beroperasi normal",
      cpuUsage: "24%",
      memory: "4.2 GB",
      activeUsers: "1,492"
    };

    const revenue = {
      currentMonth: "Rp 124.5M",
      growth: "+14.5% vs bulan lalu"
    };

    const recentUsers = [
      { name: "Andi Saputra", email: "andi@gmail.com", role: "Siswa", status: "Aktif", date: "Hari Ini, 10:45", statusColor: "success" },
      { name: "Budi Santoso", email: "budi.s@gmail.com", role: "Umum", status: "Aktif", date: "Hari Ini, 09:12", statusColor: "success" },
      { name: "Siti Aminah", email: "siti.a@sekolah.id", role: "Mentor", status: "Pending", date: "Kemarin, 15:30", statusColor: "warning" },
    ];

    return { systemStatus, revenue, recentUsers };
  }
}
