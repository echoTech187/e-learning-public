import { Category } from "./Category";

export interface CourseSection {
  id: string;
  course_id: string;
  title: string;
  description?: string | null;
  order_index?: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  section_id: string;
  title: string;
  type: "video" | "youtube" | "pdf" | "article" | "quiz" | "live";
  content?: string | null;
  duration?: number;
  is_free?: boolean | number;
  order_index?: number;
}

export interface CourseDetailExtra {
  objectives?: string[];
  curriculum?: {
    title: string;
    items: string[];
  }[];
  instructor?: {
    name: string;
    role: string;
    photo?: string | null;
    bio?: string | null;
  };
  reviews?: any[];
}

export interface Course {
  id: string;
  instructor_id: string;
  category_id?: string | null;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  trailer_video?: string | null;
  price: number | string;
  discount_price?: number | string | null;
  level: string;
  language?: string;
  status: string;
  is_featured?: number | boolean;
  total_students?: number | string;
  total_lessons?: number | string;
  total_duration?: number | string;
  rating?: number | string;
  category_name?: string;
  instructor_name?: string;
  instructor_photo?: string | null;
  instructor_role?: string;
  instructor_bio?: string;
  instructor_rating?: number;
  instructor_students?: string | number;
  instructor_courses?: number;
  requirements?: string | string[];
  target_audience?: string | string[];
  facilities?: string | string[];
  sections?: CourseSection[];
  created_at?: string;
  updated_at?: string;
}
