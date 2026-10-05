import { Testimonial } from "../Entities/Testimonial";
import { SiteStats } from "../Entities/SiteStats";
import { ISiteInfoRepository } from "./ISiteInfoRepository";

export class SiteInfoRepository implements ISiteInfoRepository {
  private readonly baseUrl = process.env.API_GATEWAY_URL || "http://e-learning-docker-api-1";

  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/testimonials`, {
        next: { revalidate: 300, tags: ["testimonials"] }
      });
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch (error) {
      console.error("[SiteInfoRepository] getTestimonials error:", error);
      return [];
    }
  }

  async getSiteStats(): Promise<SiteStats | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/stats`, {
        next: { revalidate: 120, tags: ["stats"] }
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || null;
    } catch (error) {
      console.error("[SiteInfoRepository] getSiteStats error:", error);
      return null;
    }
  }
}
