import { Testimonial } from "../Entities/Testimonial";
import { SiteStats } from "../Entities/SiteStats";
import { CompanyProfileDomainData } from "../UseCases/GetCompanyProfileUseCase";

export interface CategoryUIModel {
  name: string;
  icon: string;
  color: string;
  count: number;
}

export interface TestimonialUIModel {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  rating: number;
  text: string;
}

export interface CompanyProfileUIModel {
  categories: CategoryUIModel[];
  testimonials: TestimonialUIModel[];
  stats: SiteStats;
}

export class CompanyProfileViewModel {
  static toUIModel(data: CompanyProfileDomainData): CompanyProfileUIModel {
    const categories: CategoryUIModel[] = data.categories.map((c) => {
      let iconData = { icon: "fas fa-folder", color: "#6C47FF" };
      try {
        if (c.icon) {
          iconData = typeof c.icon === "string" ? JSON.parse(c.icon) : c.icon;
        }
      } catch (e) {
        // Fallback default icon
      }

      return {
        name: c.name,
        icon: iconData.icon || "fas fa-folder",
        color: iconData.color || "#6C47FF",
        count: Number(c.course_count) || 0,
      };
    });

    const testimonials: TestimonialUIModel[] = data.testimonials.map((t) => ({
      ...t,
      rating: Number(t.rating) || 5,
    }));

    const defaultStats: SiteStats = {
      students_count: "0",
      courses_count: "0",
      instructors_count: "0",
      average_rating: "0/5",
      satisfaction_rate: "98%",
      employment_rate: "85%",
      hero_progress: "78",
      hero_current_lesson: "Sedang belajar: Async/Await",
      hero_cert_title: "Sertifikat Diterbitkan!",
      hero_cert_course: "React.js Advanced",
      hero_new_students: "+128 siswa baru",
      hero_new_students_sub: "hari ini",
    };

    return {
      categories,
      testimonials,
      stats: data.stats || defaultStats,
    };
  }
}
