import { ICategoryRepository } from "../Repositories/ICategoryRepository";
import { ISiteInfoRepository } from "../Repositories/ISiteInfoRepository";
import { Category } from "../Entities/Category";
import { Testimonial } from "../Entities/Testimonial";
import { SiteStats } from "../Entities/SiteStats";

export interface CompanyProfileDomainData {
  categories: Category[];
  testimonials: Testimonial[];
  stats: SiteStats | null;
}

export class GetCompanyProfileUseCase {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly siteInfoRepository: ISiteInfoRepository
  ) {}

  async execute(): Promise<CompanyProfileDomainData> {
    const [categories, testimonials, stats] = await Promise.all([
      this.categoryRepository.getCategories(),
      this.siteInfoRepository.getTestimonials(),
      this.siteInfoRepository.getSiteStats(),
    ]);

    return {
      categories,
      testimonials,
      stats,
    };
  }
}
