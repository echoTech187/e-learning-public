import { Category } from "../Entities/Category";
import { ICategoryRepository } from "./ICategoryRepository";

export class CategoryRepository implements ICategoryRepository {
  private readonly baseUrl = process.env.API_GATEWAY_URL || "http://e-learning-docker-api-1";

  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/categories`, {
        next: { revalidate: 300, tags: ["categories"] }
      });
      if (!res.ok) return [];
      const json = await res.json();
      return Array.isArray(json) ? json : (json.data || []);
    } catch (error) {
      console.error("[CategoryRepository] getCategories error:", error);
      return [];
    }
  }
}
