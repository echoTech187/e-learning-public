import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ClassroomRepository } from "@/core/Repositories/ClassroomRepository";
import { GetCourseBySlugUseCase } from "@/core/UseCases/GetCourseBySlugUseCase";
import { CourseRepository } from "@/core/Repositories/CourseRepository";
import { GetUserEnrollmentsUseCase } from "@/core/UseCases/GetUserEnrollmentsUseCase";
import { EnrollmentRepository } from "@/core/Repositories/EnrollmentRepository";
import ClassroomPlayer from "./ClassroomPlayer";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ course_slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course_slug } = await params;
  const courseUseCase = new GetCourseBySlugUseCase(new CourseRepository());
  const course = await courseUseCase.execute(course_slug);
  return { title: course ? `${course.title} | EduNusa` : "Ruang Belajar | EduNusa" };
}

export default async function BelajarPage({ params }: Props) {
  const { course_slug } = await params;
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
  
  if (!course) {
    console.error("Course not found for slug:", course_slug);
    redirect("/dashboard?error=course_not_found");
  }

  const enrollmentUseCase = new GetUserEnrollmentsUseCase(new EnrollmentRepository());
  const enrollments = await enrollmentUseCase.execute(userId);
  
  const enrollment = enrollments.find(e => e.course_id === course.id);
  if (!enrollment) {
    console.error("Enrollment not found for course_id:", course.id, "among", enrollments);
    redirect("/dashboard?error=not_enrolled");
  }

  const repo = new ClassroomRepository(token);

  try {
    const classroom = await repo.getClassroom(enrollment.id);
    return <ClassroomPlayer classroom={classroom} enrollmentId={enrollment.id} courseSlug={course_slug} token={token} />;
  } catch (error) {
    console.error("Failed to load classroom data:", error);
    redirect("/dashboard?error=classroom_fetch_failed");
  }
}