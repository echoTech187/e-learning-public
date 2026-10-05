import { Coupon } from "../Entities/Coupon";

export interface ICouponRepository {
  getAvailableCoupons(): Promise<Coupon[]>;
}
