import { useState, useCallback, useEffect } from 'react';
import { getCourseCatalogUI, getUserEnrollments, getPlatformSettings, getAvailableCoupons } from '@/actions/courseActions';
import { CourseCatalogItemUIModel } from '@/core/ViewModels/CourseCatalogViewModel';

export function useCartViewModel(getTotalPrice: () => number, appliedCoupon: any) {
  const [mounted, setMounted] = useState(false);
  const [recommendedCourses, setRecommendedCourses] = useState<CourseCatalogItemUIModel[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  const [serviceFee, setServiceFee] = useState<number>(0);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      setIsLoadingRecommendations(true);
      try {
        const [catalog, enrollments, settings, coupons] = await Promise.all([
          getCourseCatalogUI(),
          getUserEnrollments().catch(() => []),
          getPlatformSettings(),
          getAvailableCoupons()
        ]);
        const enrolledIds = new Set(enrollments.map((e: any) => e.course_id));
        const filtered = catalog.filter((c: any) => !enrolledIds.has(c.id)).slice(0, 3);
        setRecommendedCourses(filtered);
        setServiceFee(Number(settings?.service_fee) || 0);
        setAvailableCoupons(coupons);
      } catch (err) {
        console.error("Failed to load cart recommendations", err);
      } finally {
        setIsLoadingRecommendations(false);
      }
    }
    fetchData();
  }, []);

  const calculateDiscount = useCallback(() => {
    if (!appliedCoupon) return 0;
    const basePrice = getTotalPrice() * 1.5;
    const amt = parseFloat(appliedCoupon.discount_amount.toString());
    if (appliedCoupon.discount_type === 'fixed') {
      return amt;
    } else {
      return (basePrice * amt) / 100;
    }
  }, [appliedCoupon, getTotalPrice]);

  const totalBasePrice = getTotalPrice() * 1.5;
  const totalDiscount = (getTotalPrice() * 0.5) + calculateDiscount();
  const finalPrice = totalBasePrice - totalDiscount + serviceFee;

  return {
    mounted,
    recommendedCourses,
    isLoadingRecommendations,
    serviceFee,
    availableCoupons,
    totalBasePrice,
    totalDiscount,
    finalPrice,
    calculateDiscount
  };
}
