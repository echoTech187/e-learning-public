import { getCourseDetailUI, getUserEnrollments } from "@/actions/courseActions";
import CourseDetailClient from "./CourseDetailClient";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const course = await getCourseDetailUI(resolvedParams.slug);

  if (!course) {
    return {
      title: "Kursus Tidak Ditemukan - EduNusa",
    };
  }

  return {
    title: `${course.title} - EduNusa`,
    description: course.description,
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const [course, enrollments] = await Promise.all([
    getCourseDetailUI(resolvedParams.slug),
    getUserEnrollments(),
  ]);

  if (!course) {
    return (
      <main className="min-h-screen pt-32 pb-20 bg-slate-50 text-center">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="w-20 h-20 bg-indigo-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            <i className="fas fa-search"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Kursus Tidak Ditemukan</h2>
          <p className="text-slate-500 mb-6 text-sm">
            Kursus yang Anda cari mungkin telah dinonaktifkan atau tautan URL salah.
          </p>
          <Link href="/kursus" className="btn-pill-indigo inline-flex items-center gap-2">
            <i className="fas fa-arrow-left"></i> Kembali ke Katalog Kursus
          </Link>
        </div>
      </main>
    );
  }

  return <CourseDetailClient course={course} enrollments={enrollments} />;
}
