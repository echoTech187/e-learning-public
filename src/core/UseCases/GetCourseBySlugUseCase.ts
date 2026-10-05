import { Course } from "../Entities/Course";
import { ICourseRepository } from "../Repositories/ICourseRepository";

export class GetCourseBySlugUseCase {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async execute(slug: string): Promise<Course | null> {
    if (!slug) throw new Error("Slug cannot be empty");
    
    const course = await this.courseRepository.getCourseBySlug(slug);
    return course;
  }
}
