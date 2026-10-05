import { useState, useMemo, useEffect, useCallback } from 'react';
import { CreateCheckoutSessionUseCase } from '../UseCases/CreateCheckoutSessionUseCase';
import { OrderRepository } from '../Repositories/OrderRepository';
import { getPlatformSettings } from '@/actions/courseActions'; // Assuming this acts as UseCase for now

export function useCheckoutViewModel(getTotalPrice: () => number, appliedCoupon: { code: string; discount_amount: number | string; discount_type: string } | null) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);
  const [serviceFee, setServiceFee] = useState<number>(0);

  // Instansiasi UseCase
  const useCase = useMemo(() => {
    const repository = new OrderRepository();
    return new CreateCheckoutSessionUseCase(repository);
  }, []);

  // Fetch Settings
  const fetchSettings = useCallback(async () => {
    try {
      const settings = await getPlatformSettings();
      if (settings && settings.service_fee !== undefined) {
        setServiceFee(parseFloat(String(settings.service_fee)) || 0);
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    }
  }, []);

  const createCheckoutSession = async (courseId: string, couponCode?: string) => {
    setIsProcessing(true);
    try {
      const response = await useCase.execute(courseId, couponCode);
      return response;
    } catch (error) {
      console.error('Checkout failed', error);
      return { success: false, message: 'Checkout gagal. Silakan coba lagi.' };
    } finally {
      // setIsProcessing di-handle oleh caller jika perlu menutup state
    }
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const basePrice = getTotalPrice() * 1.5; // Total MRP
    const amt = parseFloat(appliedCoupon.discount_amount.toString());
    if (appliedCoupon.discount_type === 'fixed') {
        return amt;
    } else {
        return (basePrice * amt) / 100;
    }
  };

  const totalBasePrice = getTotalPrice() * 1.5;
  const totalDiscount = (getTotalPrice() * 0.5) + calculateDiscount();
  const finalPrice = totalBasePrice - totalDiscount + serviceFee;

  return {
    isProcessing,
    setIsProcessing,
    isCheckoutComplete,
    setIsCheckoutComplete,
    createCheckoutSession,
    serviceFee,
    fetchSettings,
    calculateDiscount,
    totalBasePrice,
    totalDiscount,
    finalPrice
  };
}
