export class DashboardMentorViewModel {
  static async getDashboardData() {
    const liveClass = {
      title: "Bootcamp UI/UX Design Cohort 4",
      time: "Hari ini, 19:00 WIB",
      activeStudents: 45
    };

    const stats = {
      totalStudents: "128",
      averageRating: "4.9/5",
      pendingTasks: "45",
      unreadMessages: "12"
    };

    return { liveClass, stats };
  }
}
