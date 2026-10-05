import { cookies } from "next/headers";
import { ILessonProgressRepository } from "./ILessonProgressRepository";

export class LessonProgressRepository implements ILessonProgressRepository {
  private readonly baseUrl = process.env.API_GATEWAY_URL || "http://e-learning-docker-api-1";

  async markComplete(lessonId: string, watchTime: number = 0): Promise<boolean> {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;
      if (!token) return false;

      const response = await fetch(`${this.baseUrl}/api/v1/lesson-progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          lesson_id: lessonId,
          is_completed: true,
          watch_time: watchTime
        })
      });

      return response.ok;
    } catch (error) {
      console.error("[LessonProgressRepository] markComplete error:", error);
      return false;
    }
  }
}
