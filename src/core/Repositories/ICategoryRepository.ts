import { Category } from "../Entities/Category";

export interface ICategoryRepository {
  getCategories(): Promise<Category[]>;
}
