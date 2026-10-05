import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ClassroomRepository } from "@/core/Repositories/ClassroomRepository";
import { GetCourseBySlugUseCase } from "@/core/UseCases/GetCourseBySlugUseCase";
import { CourseRepository } from "@/core/Repositories/CourseRepository";
import { GetUserEnrollmentsUseCase } from "@/core/UseCases/GetUserEnrollmentsUseCase";
import { EnrollmentRepository } from "@/core/Repositories/EnrollmentRepository";
import QuizSessionClient from "./QuizSessionClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kuis | Edunusa",
};

interface PageProps {
  params: Promise<{ course_slug: string; quizId: string }>;
}

export default async function QuizPage({ params }: PageProps) {
  const { course_slug, quizId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userStr = cookieStore.get("user")?.value;
  
  if (!token || !userStr) redirect("/masuk");

  let userId = "";
  try {
    const user = JSON.parse(userStr);
    userId = user.id;
  } catch {
    redirect("/masuk");
  }

  const courseUseCase = new GetCourseBySlugUseCase(new CourseRepository());
  const course = await courseUseCase.execute(course_slug);
  
  if (!course) redirect("/dashboard");

  const enrollmentUseCase = new GetUserEnrollmentsUseCase(new EnrollmentRepository());
  const enrollments = await enrollmentUseCase.execute(userId);
  
  const enrollment = enrollments.find(e => e.course_id === course.id);
  if (!enrollment) redirect("/dashboard");

  const repo = new ClassroomRepository(token);

  try {
    // Ambil data kuis dan soal dari gateway
    const quizData = await repo.getQuiz(quizId);
    
    if (!quizData) {
      redirect(`/class-room/${course_slug}?error=quiz_not_found`);
    }

    return (
      <QuizSessionClient 
        quizData={quizData} 
        quizId={quizId} 
        enrollmentId={enrollment.id}
        courseSlug={course_slug}
        token={token}
      />
    );
  } catch (error: any) {
    console.error("Failed to load quiz data:", error);
    redirect(`/class-room/${course_slug}?error=quiz_load_failed`);
  }
}
