import { Course, CourseDetailExtra } from "../Entities/Course";
import { ICourseRepository } from "../Repositories/ICourseRepository";

export interface CourseDetailResult {
  course: Course | null;
  extra: CourseDetailExtra | null;
}

export class GetCourseDetailUseCase {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async execute(slug: string): Promise<CourseDetailResult> {
    const course = await this.courseRepository.getCourseBySlug(slug);
    if (!course || !course.id) {
      return { course: null, extra: null };
    }

    const extra = await this.courseRepository.getCourseDetailExtra(course.id);
    return { course, extra };
  }
}
