import { Course } from "../Entities/Course";
import { ICourseRepository } from "../Repositories/ICourseRepository";

export class GetPublicCoursesUseCase {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async execute(filters?: Record<string, string>): Promise<Course[]> {
    return this.courseRepository.getPublicCourses(filters);
  }
}
