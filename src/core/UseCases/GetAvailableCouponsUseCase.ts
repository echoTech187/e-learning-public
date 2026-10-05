import { ICouponRepository } from "../Repositories/ICouponRepository";
import { Coupon } from "../Entities/Coupon";

export class GetAvailableCouponsUseCase {
  constructor(private repository: ICouponRepository) {}

  async execute(): Promise<Coupon[]> {
    return this.repository.getAvailableCoupons();
  }
}
