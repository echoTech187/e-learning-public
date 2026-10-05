"use client";

import { getCourseThumbnail } from "@/core/utils/imageHelper";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/core/store/useCartStore";
import Script from "next/script";
import toast, { Toaster } from "react-hot-toast";
import { useCheckoutViewModel } from "@/core/ViewModels/CheckoutViewModel";
import { getPlatformSettings } from "@/actions/courseActions";
import { ShieldCheck, CheckCircle2, CreditCard, ArrowRight } from "lucide-react";
import { FlatButton } from "@/components/ui/FlatButton";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart, appliedCoupon } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  const { 
    isProcessing, setIsProcessing, 
    isCheckoutComplete, setIsCheckoutComplete, 
    createCheckoutSession,
    serviceFee,
    fetchSettings,
    calculateDiscount,
    totalBasePrice,
    totalDiscount,
    finalPrice
  } = useCheckoutViewModel(getTotalPrice, appliedCoupon);

  useEffect(() => {
    setMounted(true);
    if (items.length === 0 && mounted && !isCheckoutComplete) {
      router.push("/cart");
    }
  }, [items, mounted, router, isCheckoutComplete]);

  // Fetch Service Fee via ViewModel
  useEffect(() => {
    if (!mounted) return;
    fetchSettings();
  }, [mounted, fetchSettings]);

  // Handle third-party sandbox CSP noise gracefully
  useEffect(() => {
    const handleSecurityViolation = (e: any) => {
      if (
        e?.blockedURI?.includes("midtrans") ||
        e?.originalPolicy?.includes("midtrans") ||
        e?.documentURI?.includes("midtrans")
      ) {
        e.stopPropagation?.();
      }
    };
    window.addEventListener("securitypolicyviolation", handleSecurityViolation);
    return () => window.removeEventListener("securitypolicyviolation", handleSecurityViolation);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen pt-28 pb-20 relative overflow-hidden bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="bg-white rounded-[24px] border border-slate-50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] p-6 sm:p-8">
                <div className="animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-48 h-8 mb-6"></div>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4 items-center p-4 bg-slate-50/70 rounded-2xl border border-slate-50">
                      <div className="w-24 h-16 rounded-xl animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200"></div>
                      <div className="flex-grow">
                        <div className="animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-3/4 h-5 mb-2"></div>
                        <div className="animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-1/3 h-4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-[24px] border border-slate-50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] p-6 sm:p-8">
                <div className="animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-48 h-8 mb-6"></div>
                <div className="space-y-4 mb-8">
                  <div className="animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-full h-5"></div>
                  <div className="animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-full h-5"></div>
                  <div className="animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-full h-5"></div>
                </div>
                <div className="animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-full w-full h-14"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) return null;

  const handleCheckout = async () => {
    if (!items || items.length === 0) return;

    setIsProcessing(true);
    try {
      const courseId = items[0].id;
      const res = await createCheckoutSession(courseId, appliedCoupon?.code);

      if (res.pendingOrderId) {
        toast(res.message || "Anda sudah memiliki tagihan pending untuk kursus ini. Mengalihkan...", { icon: "ℹ️" });
        setIsCheckoutComplete(true);
        clearCart();
        router.push("/pending-transaction/" + res.pendingOrderId);
        return;
      }

      if (res.success && res.data?.snap_token) {
        // Trigger Midtrans Snap
        if (typeof window !== "undefined" && (window as any).snap) {
          (window as any).snap.pay(res.data?.snap_token, {
            onSuccess: function (result: any) {
              setIsCheckoutComplete(true);
              toast.success("Pembayaran berhasil!");
              clearCart();

              if (typeof window !== "undefined") {
                const orderCache = {
                   ...res.data,
                   status: "success",
                   midtrans_data: result
                };
                sessionStorage.setItem("order_cache_" + res.data?.id, JSON.stringify(orderCache));
              }

              router.push("/pending-transaction/" + res.data?.id);
            },
            onPending: function (result: any) {
              setIsCheckoutComplete(true);
              toast("Menunggu pembayaran Anda!", { icon: "⏳" });
              clearCart();
              router.push("/pending-transaction/" + res.data?.id);
            },
            onError: function (result: any) {
              toast.error("Pembayaran gagal atau dibatalkan.");
              setIsProcessing(false);
            },
            onClose: function () {
              setIsProcessing(false);
              toast.error("Anda menutup popup tanpa menyelesaikan pembayaran.");
            },
          });
        } else {
          toast.error("Modul pembayaran Midtrans sedang dimuat. Silakan coba lagi.");
          setIsProcessing(false);
        }
      } else {
        toast.error(res.message || "Gagal menyiapkan pembayaran.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Checkout failed", error);
      toast.error("Checkout gagal. Silakan coba lagi.");
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-16">
      <Toaster position="top-center" />
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />

      <div className="container mx-auto px-6">

        {/* 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Order Summary */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[24px] border border-slate-50 shadow-sm p-6 sm:p-8">
              {/* Header Section */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Ringkasan Pesanan</h1>
                </div>
                <div className="font-bold text-slate-800 text-lg">
                  {items.length} Kursus
                </div>
              </div>

              {/* Table Headers (Desktop only) */}
              <div className="hidden md:flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-wider pb-4 mb-6 px-2">
                <div>Detail Kursus</div>
                <div>Total Harga</div>
              </div>

              {/* Items List */}
              <div className="space-y-4 mb-8">
                {items.map((item, index) => (
                  <div key={item.id || index} className="relative bg-white border border-slate-50 rounded-2xl p-4 sm:px-4 sm:py-3 flex flex-col md:flex-row gap-5 items-start md:items-center hover:border-slate-200 hover:shadow-sm transition-all duration-300">
                    {/* Course Details (Left) */}
                    <div className="w-full md:w-7/12 flex gap-4 items-center">
                      <div className="w-24 h-24 sm:w-28 sm:h-20 bg-slate-100 rounded-xl flex-shrink-0 bg-cover bg-center border border-slate-50" style={{ backgroundImage: `url(${getCourseThumbnail(item.thumbnail)})` }}></div>
                      <div className="min-w-0 flex-grow">
                        <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-1 leading-snug line-clamp-2">{item.title}</h3>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1.5">
                          Mentor <span className="text-slate-700 font-semibold">{item.instructor_name}</span>
                        </p>
                        <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600">
                          Akses Selamanya
                        </div>
                      </div>
                    </div>

                    {/* Price Details (Right) */}
                    <div className="w-full md:w-5/12 flex sm:flex-row md:flex-col lg:flex-col justify-between md:justify-center items-center md:items-end lg:items-end border-t md:border-t-0 border-slate-50 pt-3 md:pt-0">
                      <p className="text-xs font-semibold text-slate-400 line-through md:mb-1">
                        Rp {(item.price * 1.5).toLocaleString("id-ID")}
                      </p>
                      <p className="text-lg sm:text-xl font-black text-slate-900">
                        {item.price_formatted}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Guarantee Box */}
              <div className="bg-slate-50 rounded-2xl px-3 py-2 border border-slate-50 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 flex-shrink-0 shadow-sm border border-slate-50">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Garansi 7 Hari Uang Kembali</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Jaminan kepuasan belajar atau uang Anda kembali 100%.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[24px] border border-slate-50 shadow-sm overflow-hidden lg:sticky lg:top-28 flex flex-col">
              {/* Top Thick Border */}
              <div className="h-2.5 w-full bg-indigo-800"></div>

              <div className="p-6 sm:p-8">
                <h3 className="text-xl font-extrabold text-slate-800 mb-8 text-center">
                  Pembayaran
                </h3>

                {/* Coupons Section (Display Only) */}
                {appliedCoupon && (
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-50 rounded-xl mb-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                      {appliedCoupon.code}
                    </div>
                    <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">TERAPLIKASI</div>
                  </div>
                )}

                <h4 className="text-[11px] font-black text-slate-400 tracking-wider mb-4 uppercase">
                  Detail Harga ({items.length} Kursus)
                </h4>

                <div className="space-y-3.5 mb-6 text-sm">
                  <div className="flex justify-between items-center text-slate-500 font-medium">
                    <span>Total Harga Asli</span>
                    <span className="font-semibold text-slate-700">Rp {totalBasePrice.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 font-medium">
                    <span>Diskon Potongan</span>
                    <span className="font-semibold text-red-500">-Rp {(getTotalPrice() * 0.5).toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 font-medium">
                    <span>Diskon Kupon</span>
                    {appliedCoupon ? (
                      <span className="font-semibold text-emerald-500">-Rp {calculateDiscount().toLocaleString('id-ID')}</span>
                    ) : (
                      <span className="font-semibold text-slate-400">Rp 0</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-slate-500 font-medium">
                    <span>Biaya Layanan</span>
                    {serviceFee > 0 ? (
                      <span className="font-semibold text-slate-700">Rp {serviceFee.toLocaleString("id-ID")}</span>
                    ) : (
                      <span className="font-semibold text-indigo-600">Gratis</span>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5 mt-2 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-800">Total Tagihan</span>
                    <span className="font-black text-2xl text-slate-900">Rp {finalPrice.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <FlatButton
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  colorTheme="blue"
                  icon={<ArrowRight className="w-5 h-5 text-white" />}
                  fullWidth
                  className="mt-2 font-extrabold uppercase tracking-widest text-sm"
                  iconPosition="right"
                >
                  {isProcessing ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin mr-2"></i> Memproses...
                    </>
                  ) : (
                    "BAYAR SEKARANG"
                  )}
                </FlatButton>
              </div>
              
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  Pembayaran aman. 100% Bergaransi.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
