export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  order_id?: string | null;
  progress: number | string;
  enrolled_at: string;
  completed_at?: string | null;
  expires_at?: string | null;
  course_title?: string;
  course_slug?: string;
  course_thumbnail?: string;
}
