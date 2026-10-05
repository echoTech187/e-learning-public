import { ILessonProgressRepository } from "../Repositories/ILessonProgressRepository";

export class MarkLessonCompleteUseCase {
  constructor(private readonly lessonProgressRepo: ILessonProgressRepository) {}

  async execute(lessonId: string, watchTime: number = 0): Promise<boolean> {
    if (!lessonId) throw new Error("Lesson ID is required");
    return this.lessonProgressRepo.markComplete(lessonId, watchTime);
  }
}
