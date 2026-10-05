import { Testimonial } from "../Entities/Testimonial";
import { SiteStats } from "../Entities/SiteStats";

export interface ISiteInfoRepository {
  getTestimonials(): Promise<Testimonial[]>;
  getSiteStats(): Promise<SiteStats | null>;
}
