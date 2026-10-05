"use server";

import { SiteInfoRepository } from "@/core/Repositories/SiteInfoRepository";

export async function getTestimonials() {
  const repo = new SiteInfoRepository();
  return repo.getTestimonials();
}

export async function getSiteStats() {
  const repo = new SiteInfoRepository();
  return repo.getSiteStats();
}

export async function getCourseDetail(courseId: string) {
  try {
    const res = await fetch(`http://e-learning-docker-api-1/api/v1/course-detail/${courseId}`, {
      next: { revalidate: 60, tags: ["course-detail-" + courseId] }
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (e) {
    return null;
  }
}
