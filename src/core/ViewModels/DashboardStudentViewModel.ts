import { EnrollmentRepository } from '../Repositories/EnrollmentRepository';
import { GetUserEnrollmentsUseCase } from '../UseCases/GetUserEnrollmentsUseCase';
import { Enrollment } from '../Entities/Enrollment';

export interface DashboardStudentUIModel {
  activeCourses: {
    id: string;
    course_id: string;
    name: string;
    thumbnail: string | null;
    color: string;
    icon: string;
    sub: string;
    slug: string;
  }[];
  // Hardcoded for now as per current UI
  learningPaths: {
    title: string;
    hours: string;
    students: string;
    color: string;
    text: string;
  }[];
  pendingTasks: {
    color: string;
    icon: string;
    name: string;
    sub: string;
    date: string;
  }[];
}

export class DashboardStudentViewModel {
  static async getDashboardData(userId: string): Promise<DashboardStudentUIModel> {
    const enrollmentRepo = new EnrollmentRepository();
    const getEnrollmentsUseCase = new GetUserEnrollmentsUseCase(enrollmentRepo);
    
    let enrollments: Enrollment[] = [];
    if (userId) {
      enrollments = await getEnrollmentsUseCase.execute(userId);
    }

    // Colors and icons for the active courses (cycling through a set for visual appeal)
    const colors = ["#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#10b981", "#ec4899"];
    const icons = ["fas fa-fire", "fas fa-paint-brush", "fab fa-google", "fas fa-film", "fas fa-code", "fas fa-laptop-code"];

    const activeCourses = enrollments.map((enrollment, index) => ({
      id: enrollment.id,
      course_id: enrollment.course_id,
      name: enrollment.course_title || "Kursus EduNusa",
      thumbnail: enrollment.course_thumbnail || null,
      color: colors[index % colors.length],
      icon: icons[index % icons.length],
      sub: "Lanjutkan Belajar",
      slug: (enrollment as any).course_slug || `course-${enrollment.course_id}` // Fallback if slug isn't joined
    }));

    // Placeholder data for Learning Paths (Jalur Belajarmu)
    const learningPaths = [
      { title: "Intro to React", hours: "12 jam video", students: "423", color: "#e0e7ff", text: "#4f46e5" },
      { title: "Become a Manager", hours: "8 jam video", students: "648", color: "#fce7f3", text: "#db2777" },
      { title: "Sketch from A to Z", hours: "24 jam video", students: "562", color: "#ecfdf5", text: "#059669" },
    ];

    // Placeholder data for Pending Tasks (Tugas Menunggu)
    const pendingTasks = [
      { color: "#ef4444", icon: "fas fa-code", name: "Tugas HTML Form & Validasi", sub: "Kelas Frontend Web Dev", date: "Hari Ini, 23:59" },
      { color: "#f59e0b", icon: "fas fa-palette", name: "Desain UI/UX dengan Figma", sub: "Kelas UI/UX Design", date: "Besok, 12:00" },
      { color: "#3b82f6", icon: "fas fa-database", name: "Kuis Relasi Database MySQL", sub: "Kelas Backend PHP", date: "3 Hari Lagi" },
    ];

    return {
      activeCourses,
      learningPaths,
      pendingTasks
    };
  }
}
