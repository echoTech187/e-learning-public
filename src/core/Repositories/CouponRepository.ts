import { ICouponRepository } from "./ICouponRepository";
import { Coupon } from "../Entities/Coupon";

export class CouponRepository implements ICouponRepository {
  async getAvailableCoupons(): Promise<Coupon[]> {
    const baseUrl = process.env.API_GATEWAY_URL || "http://e-learning-docker-api-1";
    const res = await fetch(`${baseUrl}/api/v1/coupons`, {
      next: { revalidate: 60, tags: ["coupons"] }
    });
    
    if (!res.ok) {
      return [];
    }
    
    const json = await res.json();
    return json.data || [];
  }
}
