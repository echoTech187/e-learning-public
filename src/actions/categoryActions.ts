"use server";

import { CategoryRepository } from "@/core/Repositories/CategoryRepository";

export async function getCategories() {
  const repo = new CategoryRepository();
  return repo.getCategories();
}
