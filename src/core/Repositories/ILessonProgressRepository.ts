export interface ILessonProgressRepository {
  markComplete(lessonId: string, watchTime: number): Promise<boolean>;
}
