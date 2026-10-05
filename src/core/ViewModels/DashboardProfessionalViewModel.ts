export class DashboardProfessionalViewModel {
  static async getDashboardData(userId: string) {
    const inProgress = [
      { title: "Fullstack Next.js & Node.js", progress: 75, lastLesson: "API Routes Automation", color: "#4f46e5", bg: "#e0e7ff" },
      { title: "Advanced Data Science", progress: 40, lastLesson: "Machine Learning Basics", color: "#059669", bg: "#d1fae5" }
    ];
  
    const recommendations = [
      { title: "AWS Cloud Architect", category: "Cloud Computing", rating: 4.9, students: "12k+", price: "Rp 850.000", color: "#f59e0b" },
      { title: "Mastering Docker & K8s", category: "DevOps", rating: 4.8, students: "8k+", price: "Rp 600.000", color: "#3b82f6" },
      { title: "Cybersecurity Expert", category: "Security", rating: 4.9, students: "5k+", price: "Rp 950.000", color: "#db2777" },
    ];

    return { inProgress, recommendations };
  }
}
