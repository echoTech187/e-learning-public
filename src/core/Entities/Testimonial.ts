export interface Testimonial {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  rating: number | string;
  text: string;
  created_at?: string;
  updated_at?: string;
}
