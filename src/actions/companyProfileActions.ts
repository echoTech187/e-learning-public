"use server";

import { CategoryRepository } from "@/core/Repositories/CategoryRepository";
import { SiteInfoRepository } from "@/core/Repositories/SiteInfoRepository";
import { GetCompanyProfileUseCase } from "@/core/UseCases/GetCompanyProfileUseCase";
import { CompanyProfileViewModel, CompanyProfileUIModel } from "@/core/ViewModels/CompanyProfileViewModel";

export async function getCompanyProfileData(): Promise<CompanyProfileUIModel> {
  const categoryRepo = new CategoryRepository();
  const siteInfoRepo = new SiteInfoRepository();
  const useCase = new GetCompanyProfileUseCase(categoryRepo, siteInfoRepo);

  const domainData = await useCase.execute();
  return CompanyProfileViewModel.toUIModel(domainData);
}
