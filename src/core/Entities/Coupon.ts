export interface Coupon {
  id: string;
  code: string;
  discount_amount: number | string;
  discount_type: 'fixed' | 'percentage';
  min_purchase?: number;
  valid_until?: string;
  is_active: boolean;
}
