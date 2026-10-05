"use server";

import { cookies } from "next/headers";
import { CourseRepository } from "@/core/Repositories/CourseRepository";
import { EnrollmentRepository } from "@/core/Repositories/EnrollmentRepository";
import { GetPublicCoursesUseCase } from "@/core/UseCases/GetPublicCoursesUseCase";
import { GetCourseDetailUseCase } from "@/core/UseCases/GetCourseDetailUseCase";
import { GetUserEnrollmentsUseCase } from "@/core/UseCases/GetUserEnrollmentsUseCase";
import { CourseCatalogViewModel, CourseCatalogItemUIModel } from "@/core/ViewModels/CourseCatalogViewModel";
import { CourseDetailViewModel, CourseDetailUIModel } from "@/core/ViewModels/CourseDetailViewModel";
import { Course } from "@/core/Entities/Course";
import { Enrollment } from "@/core/Entities/Enrollment";

import { PlatformSettingRepository } from "@/core/Repositories/PlatformSettingRepository";
import { GetPlatformSettingsUseCase } from "@/core/UseCases/GetPlatformSettingsUseCase";
import { CouponRepository } from "@/core/Repositories/CouponRepository";
import { GetAvailableCouponsUseCase } from "@/core/UseCases/GetAvailableCouponsUseCase";

export async function getPlatformSettings() {
  try {
    const repo = new PlatformSettingRepository();
    const useCase = new GetPlatformSettingsUseCase(repo);
    return await useCase.execute();
  } catch (error) {
    console.error("[getPlatformSettings] error:", error);
    return { service_fee: 0 };
  }
}

export async function getAvailableCoupons() {
  try {
    const repo = new CouponRepository();
    const useCase = new GetAvailableCouponsUseCase(repo);
    return await useCase.execute();
  } catch (error) {
    console.error("[getAvailableCoupons] error:", error);
    return [];
  }
}

export async function getCourses(): Promise<Course[]> {
  const courseRepo = new CourseRepository();
  const useCase = new GetPublicCoursesUseCase(courseRepo);
  return useCase.execute();
}

export async function getCourseCatalogUI(): Promise<CourseCatalogItemUIModel[]> {
  const courses = await getCourses();
  return CourseCatalogViewModel.toUIList(courses);
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const courseRepo = new CourseRepository();
  return courseRepo.getCourseBySlug(slug);
}

export async function getCourseDetailFull(slug: string) {
  const courseRepo = new CourseRepository();
  const useCase = new GetCourseDetailUseCase(courseRepo);
  return useCase.execute(slug);
}

export async function getUserEnrollments(): Promise<Enrollment[]> {
  try {
    const cookieStore = await cookies();
    const userStr = cookieStore.get("user")?.value;
    if (!userStr) return [];

    const user = JSON.parse(userStr);
    if (!user?.id) return [];

    const enrollmentRepo = new EnrollmentRepository();
    const useCase = new GetUserEnrollmentsUseCase(enrollmentRepo);
    return useCase.execute(user.id);
  } catch (e) {
    console.error("[courseActions] getUserEnrollments error:", e);
    return [];
  }
}

export async function getCourseDetailUI(slug: string): Promise<CourseDetailUIModel | null> {
  const result = await getCourseDetailFull(slug);
  if (!result || !result.course) return null;
  return CourseDetailViewModel.toUIModel(result.course, result.extra);
}
