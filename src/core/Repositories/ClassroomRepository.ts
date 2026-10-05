import { ClassroomData, QuizData, QuizResult } from "@/core/Entities/Classroom";

const API_BASE = typeof window === "undefined"
  ? ((process.env.API_GATEWAY_URL || "http://e-learning-docker-api-1") + "/api/v1")
  : (process.env.NEXT_PUBLIC_API_BASE_URL || "https://openapi.edunusa.edu.id/api/v1");

export class ClassroomRepository {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private headers() {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  async getClassroom(enrollmentId: string): Promise<ClassroomData> {
    const res = await fetch(`${API_BASE}/classroom/${enrollmentId}`, {
      headers: this.headers(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch classroom data");
    const json = await res.json();
    return json.data as ClassroomData;
  }

  async markLessonComplete(lessonId: string, watchTime = 0): Promise<void> {
    await fetch(`${API_BASE}/lesson-progress`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ lesson_id: lessonId, is_completed: true, watch_time: watchTime }),
    });
  }

  async getQuiz(quizId: string): Promise<QuizData> {
    const res = await fetch(`${API_BASE}/quizzes/${quizId}`, {
      headers: this.headers(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch quiz");
    const json = await res.json();
    return json.data as QuizData;
  }

  async startQuiz(quizId: string): Promise<{ attempt_id: string; started_at: string }> {
    const res = await fetch(`${API_BASE}/quizzes/${quizId}/start`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({}),
    });
    if (!res.ok) throw new Error("Failed to start quiz");
    const json = await res.json();
    return json.data;
  }

  async submitQuiz(
    quizId: string,
    attemptId: string,
    answers: Array<{ question_id: string; answer: string }>
  ) {
    const res = await fetch(`${API_BASE}/quizzes/${quizId}/submit`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ attempt_id: attemptId, answers }),
    });
    if (!res.ok) throw new Error("Failed to submit quiz");
    const json = await res.json();
    return json.data;
  }

  async getQuizResult(quizId: string, attemptId: string): Promise<QuizResult> {
    const res = await fetch(`${API_BASE}/quizzes/${quizId}/result/${attemptId}`, {
      headers: this.headers(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch quiz result");
    const json = await res.json();
    return json.data as QuizResult;
  }
}