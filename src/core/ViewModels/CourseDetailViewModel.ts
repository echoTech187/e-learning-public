import { Course, CourseDetailExtra } from "../Entities/Course";

export interface ObjectiveUIModel {
  id: string;
  objective: string;
}

export interface CurriculumItemUIModel {
  id: string;
  title: string;
  duration: string;
  is_preview: boolean;
}

export interface CurriculumSectionUIModel {
  id: string;
  title: string;
  items: CurriculumItemUIModel[];
  totalDuration: string;
  totalLessons: number;
}

export interface StudentReviewUIModel {
  id: string;
  name: string;
  initials: string;
  rating: number;
  date: string;
  comment: string;
}

export interface CourseDetailUIModel {
  id: string;
  title: string;
  slug: string;
  description: string;
  full_description: string;
  thumbnail: string | null;
  price: number;
  price_formatted: string;
  original_price_formatted: string | null;
  category_name: string;
  level: string;
  rating: number;
  total_students: number;
  total_lessons: number;
  total_duration: string;
  last_updated: string;
  instructor_name: string;
  instructor_role: string;
  instructor_bio: string;
  instructor_description: string;
  instructor_initials: string;
  instructor_rating: number;
  instructor_students: string;
  instructor_courses: number;
  objectives: ObjectiveUIModel[];
  curricula: CurriculumSectionUIModel[];
  requirements: string[];
  target_audience: string[];
  facilities: string[];
  reviews: StudentReviewUIModel[];
  language?: string;
  is_featured?: boolean;
}

export class CourseDetailViewModel {
  static toUIModel(course: Course, extra: any): CourseDetailUIModel {
    const priceNum = Number(course.price) || 0;
    const originalPriceNum = course.discount_price ? Number(course.discount_price) : priceNum * 1.5;

    const initials = (course.instructor_name || "Instruktur")
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const rawObjectives = extra?.objectives && extra.objectives.length > 0
      ? extra.objectives
      : [
          { id: "1", objective: "Membangun API RESTful yang aman, cepat, dan scalable sesuai standar industri." },
          { id: "2", objective: "Menguasai arsitektur enterprise modern dengan praktik Clean Architecture." },
          { id: "3", objective: "Manajemen basis data relasional tingkat lanjut, indexing, dan optimasi query." },
          { id: "4", objective: "Konfigurasi server deployment, automasi CI/CD, dan pemantauan performa real-time." },
        ];

    const objectives: ObjectiveUIModel[] = rawObjectives.map((obj: any) => ({
      id: String(obj.id || Math.random()),
      objective: obj.objective || obj.title || "",
    }));

    const rawCurricula = extra?.curricula && extra.curricula.length > 0
      ? extra.curricula
      : [
          {
            id: "sec-1",
            section_title: "Bagian 1: Pengenalan & Fondasi Arsitektur",
            items: [
              { id: "l-1", title: "Pengantar & Overview Ekosistem Pembelajaran", duration: "10:15", is_preview: true },
              { id: "l-2", title: "Setup Development Environment & Tooling Modern", duration: "14:20", is_preview: true },
              { id: "l-3", title: "Struktur Proyek Standar Enterprise", duration: "18:45", is_preview: false },
            ],
          },
          {
            id: "sec-2",
            section_title: "Bagian 2: Implementasi Bisnis Logika & Database",
            items: [
              { id: "l-4", title: "Pemodelan Data & Strict UUID Architecture", duration: "20:30", is_preview: false },
              { id: "l-5", title: "Membangun REST API Endpoint & Validasi", duration: "25:10", is_preview: false },
              { id: "l-6", title: "Autentikasi JWT & Role-Based Access Control", duration: "22:15", is_preview: false },
            ],
          },
        ];

    const curricula: CurriculumSectionUIModel[] = rawCurricula.map((sec: any) => {
      const items: CurriculumItemUIModel[] = (sec.items || []).map((item: any) => ({
        id: String(item.id || Math.random()),
        title: item.title || "",
        duration: item.duration || "10:00",
        is_preview: item.is_preview === "1" || item.is_preview === 1 || item.is_preview === true,
      }));

      const totalMins = items.reduce((acc, it) => {
        const parts = (it.duration || "10:00").split(":");
        const m = parseInt(parts[0], 10) || 10;
        return acc + m;
      }, 0);

      return {
        id: String(sec.id || Math.random()),
        title: sec.section_title || sec.title || "Bagian Pembelajaran",
        items,
        totalDuration: `${totalMins} Menit`,
        totalLessons: items.length,
      };
    });

    const totalLessons = curricula.reduce((sum, sec) => sum + sec.totalLessons, 0) || Number(course.total_lessons) || 12;
    const totalMinutes = curricula.reduce((acc, sec) => {
      const m = parseInt(sec.totalDuration, 10) || 30;
      return acc + m;
    }, 0);

    const totalHours = Math.floor(totalMinutes / 60);
    const remMinutes = totalMinutes % 60;
    const totalDurationStr = totalHours > 0 ? `${totalHours} Jam ${remMinutes} Menit` : `${totalMinutes} Menit`;

    let requirements: string[] = [];
    if (typeof course.requirements === 'string') {
      try { requirements = JSON.parse(course.requirements); } catch (e) {}
    } else if (Array.isArray(course.requirements)) {
      requirements = course.requirements;
    }

    let targetAudience: string[] = [];
    if (typeof course.target_audience === 'string') {
      try { targetAudience = JSON.parse(course.target_audience); } catch (e) {}
    } else if (Array.isArray(course.target_audience)) {
      targetAudience = course.target_audience;
    }

    let facilities: string[] = [];
    if (typeof course.facilities === 'string') {
      try { facilities = JSON.parse(course.facilities); } catch (e) {}
    } else if (Array.isArray(course.facilities)) {
      facilities = course.facilities;
    }

    const reviews: StudentReviewUIModel[] = (extra?.reviews || []).map((r: any) => {
      // Calculate initials
      const nameParts = (r.name || "").split(" ");
      let initials = "";
      if (nameParts.length > 0) initials += nameParts[0].charAt(0);
      if (nameParts.length > 1) initials += nameParts[nameParts.length - 1].charAt(0);
      initials = initials.toUpperCase() || "U";
      
      // Calculate relative date string if possible, or just use the created_at
      // A simple fallback for date string
      const dateObj = new Date(r.date);
      const now = new Date();
      const diffMs = now.getTime() - dateObj.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      let dateString = "Baru saja";
      if (diffDays > 30) {
        dateString = Math.floor(diffDays / 30) + " bulan lalu";
      } else if (diffDays > 0) {
        dateString = diffDays + " hari lalu";
      }

      return {
        id: r.id || Math.random().toString(),
        name: r.name || "Anonim",
        initials: initials,
        rating: Number(r.rating) || 5,
        date: dateString,
        comment: r.comment || "",
      };
    });

    const fullDescription = course.description && course.description !== "Dummy Description"
      ? course.description
      : "Program komprehensif ini dirancang khusus untuk membimbing Anda menguasai keahlian praktis dari nol hingga tingkat profesional. Melalui pendekatan berbasis proyek nyata (real-world project-based learning), Anda tidak hanya mempelajari teori fundamental namun juga menerapkan best-practices industri, mulai dari perancangan arsitektur sistem, keamanan data, integrasi API, hingga otomasi deployment ke server produksi.";

    let lastUpdatedStr = "Terbaru";
    const updateDate = course.updated_at || course.created_at;
    if (updateDate) {
      const d = new Date(updateDate);
      const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      if (!isNaN(d.getTime())) {
        lastUpdatedStr = `${months[d.getMonth()]} ${d.getFullYear()}`;
      }
    }

    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      full_description: fullDescription,
      thumbnail: course.thumbnail,
      price: priceNum,
      price_formatted: "Rp " + priceNum.toLocaleString("id-ID"),
      original_price_formatted: "Rp " + originalPriceNum.toLocaleString("id-ID"),
      category_name: course.category_name || "Pemrograman & Teknologi",
      level: course.level ? (course.level.charAt(0).toUpperCase() + course.level.slice(1)) : "Semua Tingkat",
      rating: Number(course.rating) || 0,
      total_students: Number(course.total_students) || 0,
      total_lessons: totalLessons,
      total_duration: totalDurationStr,
      last_updated: lastUpdatedStr,
      language: course.language || "Bahasa Indonesia",
      is_featured: course.is_featured === 1 || course.is_featured === true,
      instructor_name: course.instructor_name || "Mentor Profesional EduNusa",
      instructor_role: course.instructor_role || "Pengajar",
      instructor_bio: course.instructor_bio || "Instruktur di EduNusa",
      instructor_description: course.instructor_bio || "",
      instructor_initials: initials,
      instructor_rating: course.instructor_rating !== undefined ? Number(course.instructor_rating) : 0,
      instructor_students: course.instructor_students !== undefined ? String(course.instructor_students) : "0",
      instructor_courses: course.instructor_courses !== undefined ? Number(course.instructor_courses) : 0,
      objectives,
      curricula,
      requirements,
      target_audience: targetAudience,
      facilities,
      reviews,
    };
  }
}
