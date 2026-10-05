import { Course } from "../Entities/Course";

export interface CourseCatalogItemUIModel {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  instructor_name: string;
  instructor_role: string;
  category: string;
  level: string;
  students: number;
  price: number;
  price_formatted: string;
  rating: number;
  color: string;
}

export class CourseCatalogViewModel {
  static toUIList(courses: Course[]): CourseCatalogItemUIModel[] {
    return courses.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      thumbnail: c.thumbnail,
      instructor_name: c.instructor_name || "Mentor Ahli",
      instructor_role: c.instructor_role || "Instruktur Profesional",
      category: c.category_name || "Tanpa Kategori",
      level: c.level ? (c.level.charAt(0).toUpperCase() + c.level.slice(1)) : "Semua Level",
      students: Number(c.total_students) || 0,
      price: Number(c.price) || 0,
      price_formatted: "Rp " + Number(c.price || 0).toLocaleString("id-ID"),
      rating: Number(c.rating) || 4.5,
      color: "#6C47FF",
    }));
  }
}
