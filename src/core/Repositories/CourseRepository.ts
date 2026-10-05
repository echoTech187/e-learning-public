import { Course, CourseDetailExtra } from "../Entities/Course";
import { ICourseRepository } from "./ICourseRepository";

export class CourseRepository implements ICourseRepository {
  private readonly baseUrl = process.env.API_GATEWAY_URL || "http://e-learning-docker-api-1";

  async getPublicCourses(filters?: Record<string, string>): Promise<Course[]> {
    try {
      const query = filters ? new URLSearchParams(filters).toString() : "";
      const endpoint = `${this.baseUrl}/api/v1/courses${query ? "?" + query : ""}`;
      
      const response = await fetch(endpoint, {
        next: { revalidate: 60, tags: ["courses"] }
      });

      if (!response.ok) return [];
      const json = await response.json();
      return (json.data || []) as Course[];
    } catch (error) {
      console.error("[CourseRepository] getPublicCourses error:", error);
      return [];
    }
  }

  async getCourseBySlug(slug: string): Promise<Course | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/courses/${slug}`, {
        next: { revalidate: 60, tags: ["course-" + slug] }
      });

      if (!response.ok) return null;
      const json = await response.json();
      return (json.data || null) as Course | null;
    } catch (error) {
      console.error("[CourseRepository] getCourseBySlug error:", error);
      return null;
    }
  }

  async getCourseDetailExtra(courseId: string): Promise<CourseDetailExtra | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/course-detail/${courseId}`, {
        next: { revalidate: 60, tags: ["course-detail-" + courseId] }
      });
      if (!res.ok) return null;
      const json = await res.json();
      console.log(`[CourseRepository] getCourseDetailExtra response for ${courseId}:`, JSON.stringify(json).substring(0, 200));
      return (json.data || null) as CourseDetailExtra | null;
    } catch (error) {
      console.error("[CourseRepository] getCourseDetailExtra error:", error);
      return null;
    }
  }
}
