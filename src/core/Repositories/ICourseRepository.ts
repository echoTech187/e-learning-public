import { Course, CourseDetailExtra } from "../Entities/Course";

export interface ICourseRepository {
  getPublicCourses(filters?: Record<string, string>): Promise<Course[]>;
  getCourseBySlug(slug: string): Promise<Course | null>;
  getCourseDetailExtra(courseId: string): Promise<CourseDetailExtra | null>;
}
