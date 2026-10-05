export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  is_active?: string | boolean;
  course_count?: number | string;
  parent_id?: string | null;
  children?: Category[];
}
