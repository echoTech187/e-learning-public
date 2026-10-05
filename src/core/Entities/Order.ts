export interface OrderEntity {
  id: string;
  order_code: string;
  user_id: string;
  course_id: string;
  amount: string;
  discount: string;
  total: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded' | 'expired' | 'draft';
  payment_method: string | null;
  payment_proof: string | null;
  payment_date: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
  course_title?: string;
  course_slug?: string;
  course_thumbnail?: string;
  instructor_name?: string;
  snap_token?: string;
}
