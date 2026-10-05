"use client";

import { getCourseThumbnail } from "@/core/utils/imageHelper";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/core/store/useCartStore';
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck, ShoppingCart, Heart, Search } from 'lucide-react';
import { useCartViewModel } from '@/core/ViewModels/CartViewModel';
import { CourseCatalogItemUIModel } from '@/core/ViewModels/CourseCatalogViewModel';
import { FlatButton } from '@/components/ui/FlatButton';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { CouponCard, CouponModel } from '@/components/ui/CouponCard';
import { EmptyCoupon } from '@/components/ui/EmptyCoupon';

export default function CartPage() {
    const { items, removeItem, getTotalPrice, addItem, appliedCoupon, setAppliedCoupon } = useCartStore();
    const {
        mounted,
        recommendedCourses,
        isLoadingRecommendations,
        serviceFee,
        availableCoupons,
        totalBasePrice,
        totalDiscount,
        finalPrice,
        calculateDiscount
    } = useCartViewModel(getTotalPrice, appliedCoupon);

    // Coupon States
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

    const handleApplyCoupon = (coupon: any) => {
        setAppliedCoupon(coupon);
        setIsCouponModalOpen(false);
    };

    if (!mounted) {
        return (
            <main className="min-h-screen bg-slate-50 pt-32 pb-16">
                <div className="container mx-auto px-6">

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 max-w-md mx-auto lg:max-w-none">

                        {/* Main Empty State Skeleton */}
                        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-[24px] p-8 sm:p-12 text-center border border-slate-50 shadow-sm flex flex-col justify-center items-center lg:min-h-[440px]">
                            <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-6 sm:mb-8" />
                            <Skeleton className="h-8 w-1/2 rounded-lg mb-3 sm:mb-4" />
                            <Skeleton className="h-4 w-3/4 rounded-md mb-8 sm:mb-10" />
                            <Skeleton className="h-14 w-[220px] rounded-full" />
                        </div>

                        {/* Right Sidebar Skeleton */}
                        <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:space-y-6 flex flex-col justify-center">
                            <div className="bg-white rounded-[24px] px-3 py-2 sm:p-6 border border-none shadow-none relative overflow-hidden">
                                <div className="flex items-center justify-between mb-5 lg:mb-6">
                                    <Skeleton className="h-5 w-2/5 rounded-md" />
                                    <Skeleton className="h-6 w-12 rounded-full" />
                                </div>

                                <div className="space-y-4 lg:space-y-5">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="flex flex-row lg:flex-col xl:flex-row items-center lg:items-stretch xl:items-center gap-4 lg:gap-5">
                                            <Skeleton className="w-[84px] h-[84px] sm:w-[100px] sm:h-[100px] lg:w-full lg:h-[140px] xl:w-[100px] xl:h-[100px] rounded-2xl shrink-0" />
                                            <div className="flex-1 w-full py-1">
                                                <Skeleton className="h-4 w-11/12 rounded-md mb-2" />
                                                <Skeleton className="h-3 w-3/5 rounded-md mb-3" />
                                                <div className="flex flex-wrap justify-between items-center mt-2 gap-2">
                                                    <Skeleton className="h-4 w-2/5 rounded-md" />
                                                    <Skeleton className="h-7 w-16 rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons Skeleton */}
                            <div className="grid grid-cols-2 gap-4">
                                <Skeleton className="h-14 rounded-full w-full" />
                                <Skeleton className="h-14 rounded-full w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    const totalPrice = getTotalPrice();

    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-16">
            <div className="container mx-auto px-4 sm:px-6">


                {items.length === 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 max-w-md mx-auto lg:max-w-none">
                        {/* Main Empty State */}
                        <div className="lg:col-span-7 xl:col-span-8 bg-slate-50 rounded-[24px] p-8 sm:p-12 text-center border-none shadow-none flex flex-col justify-center items-center lg:min-h-[440px]">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 sm:mb-8 border border-slate-50">
                                <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400" strokeWidth={1.5} />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3 sm:mb-4 tracking-tight">Keranjang Kosong</h2>
                            <p className="text-[14px] sm:text-[16px] text-slate-500 mb-8 sm:mb-10 leading-relaxed max-w-md mx-auto px-2">
                                Tambahkan item untuk memulai. Jelajahi kategori untuk menemukan kursus baru dan isi keranjang Anda.
                            </p>
                            <FlatButton
                                colorTheme="blue"
                                href="/kursus"
                                className="w-full sm:w-auto rounded-full font-bold tracking-widest text-sm px-4"
                            >
                                Jelajahi
                            </FlatButton>
                        </div>

                        {/* Right Sidebar for Desktop / Bottom for Mobile */}
                        <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:space-y-6 flex flex-col justify-center">
                            {/* Featured Course Card */}
                            {isLoadingRecommendations ? (
                                <Card padding="lg" radius="2xl" className="border-none shadow-none bg-white">
                                    <div className="flex items-center justify-between mb-5 lg:mb-6">
                                        <Skeleton className="h-5 w-2/5 rounded-md" animation="wave" />
                                        <Skeleton className="h-6 w-12 rounded-full" animation="wave" />
                                    </div>
                                    <div className="space-y-4 lg:space-y-5">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="flex flex-row lg:flex-col xl:flex-row items-center lg:items-stretch xl:items-center gap-4 lg:gap-5">
                                                <Skeleton className="w-[84px] h-[84px] sm:w-[100px] sm:h-[100px] lg:w-full lg:h-[140px] xl:w-[100px] xl:h-[100px] rounded-2xl shrink-0" animation="wave" />
                                                <div className="flex-1 w-full py-1">
                                                    <Skeleton className="h-4 w-11/12 rounded-md mb-2" animation="wave" />
                                                    <Skeleton className="h-3 w-3/5 rounded-md mb-3" animation="wave" />
                                                    <div className="flex flex-wrap justify-between items-center mt-2 gap-2">
                                                        <Skeleton className="h-4 w-2/5 rounded-md" animation="wave" />
                                                        <Skeleton className="h-7 w-16 rounded-lg" animation="wave" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            ) : recommendedCourses.length > 0 && (
                                <Card padding="lg" radius="2xl" className="border-none shadow-none bg-white">
                                    <div className="flex justify-between items-center mb-5 lg:mb-6">
                                        <h3 className="font-bold text-slate-800 text-[15px] lg:text-[16px]">Kursus Pilihan</h3>
                                        <Badge colorTheme="teal" variant="soft" size="sm">Baru</Badge>
                                    </div>
                                    <div className="space-y-4 lg:space-y-5">
                                        {recommendedCourses.map(course => (
                                            <div key={course.id} className="flex flex-row lg:flex-col xl:flex-row items-center lg:items-stretch xl:items-center gap-4 lg:gap-5">
                                                <div className="w-[84px] h-[84px] sm:w-[100px] sm:h-[100px] lg:w-full lg:h-[140px] xl:w-[100px] xl:h-[100px] bg-slate-100 rounded-2xl shrink-0 overflow-hidden relative border border-slate-50">
                                                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${getCourseThumbnail(course.thumbnail)})` }}></div>
                                                </div>
                                                <div className="flex-1">
                                                    <Link href={`/kursus/${course.slug}`}>
                                                        <h4 className="font-bold text-slate-800 text-[14px] sm:text-[15px] mb-1.5 leading-snug hover:text-indigo-600 transition-colors">{course.title}</h4>
                                                    </Link>
                                                    <p className="text-[12px] sm:text-[13px] text-slate-500 mb-2 sm:mb-3 leading-snug line-clamp-2">Mentor: {course.instructor_name}</p>
                                                    <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                                                        <div className="font-bold text-slate-900 text-[14px] sm:text-[16px] whitespace-nowrap">{course.price_formatted}</div>
                                                        <FlatButton
                                                            colorTheme="orange"
                                                            size="md"
                                                            noShadow={true}
                                                            onClick={() => addItem({
                                                                id: course.id,
                                                                title: course.title,
                                                                thumbnail: course.thumbnail || '',
                                                                instructor_name: course.instructor_name,
                                                                price: course.price,
                                                                price_formatted: course.price_formatted
                                                            })}
                                                            className="rounded-full px-5 font-bold"
                                                        >
                                                            Tambah
                                                        </FlatButton>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT COLUMN: Shopping Cart */}
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-[24px] border-none shadow-none p-6 sm:p-8">
                                {/* Header Section */}
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                            <ShoppingBag className="w-5 h-5" />
                                        </div>
                                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Keranjang Belanja</h1>
                                    </div>
                                    <div className="font-bold text-slate-800 text-lg">
                                        {items.length} Kursus
                                    </div>
                                </div>

                                {/* Table Headers (Desktop only) */}
                                <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider pb-4 border-b border-slate-100 mb-6">
                                    <div className="col-span-7">Detail Kursus</div>
                                    <div className="col-span-5 text-right">Total Harga</div>
                                </div>

                                {/* Items List */}
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="relative bg-white border border-slate-50 rounded-2xl p-4 sm:px-4 sm:py-3 flex flex-col md:flex-row gap-5 items-start md:items-center hover:border-slate-200 hover:shadow-sm transition-all duration-300">
                                            {/* Close Button (Top Right) */}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="absolute top-3 right-3 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                                                title="Hapus dari keranjang"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            </button>

                                            {/* Course Details (Left) */}
                                            <div className="w-full md:w-7/12 flex gap-4 items-center pr-6">
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
                                                <span className="text-xs font-semibold text-slate-400 line-through md:mb-1">
                                                    Rp {(item.price * 1.5).toLocaleString("id-ID")}
                                                </span>
                                                <span className="text-lg sm:text-xl font-black text-slate-900">
                                                    {item.price_formatted}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Order Summary */}
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-[12px] border-none shadow-none overflow-hidden lg:sticky lg:top-28 flex flex-col">
                                {/* Top Thick Border */}
                                <div className="h-2.5 w-full bg-indigo-800"></div>

                                <div className="p-6 sm:p-8">
                                    <h3 className="text-xl font-extrabold text-slate-800 mb-8 text-center">
                                        Ringkasan Belanja
                                    </h3>

                                    {/* Coupons Section */}
                                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-50 rounded-xl mb-6">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                                            {appliedCoupon ? appliedCoupon.code : "Gunakan Kupon"}
                                        </div>
                                        <FlatButton
                                            colorTheme="teal"
                                            size="sm"
                                            onClick={() => setIsCouponModalOpen(true)}
                                            className="uppercase"
                                        >
                                            {appliedCoupon ? "GANTI" : "TERAPKAN"}
                                        </FlatButton>
                                    </div>

                                    <h4 className="text-[11px] font-black text-slate-400 tracking-wider mb-4 uppercase">
                                        Detail Harga ({items.length} Kursus)
                                    </h4>

                                    <div className="space-y-3.5 mb-6 text-sm">
                                        <div className="flex justify-between items-center text-slate-500 font-medium">
                                            <span>Total Harga Asli</span>
                                            <span className="font-semibold text-slate-700">Rp {totalBasePrice.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-500 font-medium">
                                            <span>Diskon Potongan</span>
                                            <span className="font-semibold text-red-500">-Rp {(getTotalPrice() * 0.5).toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-500 font-medium">
                                            <span>Diskon Kupon</span>
                                            {appliedCoupon ? (
                                                <span className="font-semibold text-emerald-500">-Rp {calculateDiscount().toLocaleString('id-ID')}</span>
                                            ) : (
                                                <span
                                                    className="font-semibold text-emerald-500 cursor-pointer hover:underline"
                                                    onClick={() => setIsCouponModalOpen(true)}
                                                >
                                                    Pilih Kupon
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center text-slate-500 font-medium">
                                            <span>Biaya Layanan</span>
                                            {serviceFee > 0 ? (
                                                <span className="font-semibold text-slate-700">Rp {serviceFee.toLocaleString('id-ID')}</span>
                                            ) : (
                                                <span className="font-semibold text-indigo-600">Gratis</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100 pt-5 mt-2 mb-6">
                                        <div className="flex justify-between items-center">
                                            <span className="font-extrabold text-slate-800">Total Tagihan</span>
                                            <span className="font-black text-2xl text-slate-900">Rp {finalPrice.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>

                                    <FlatButton
                                        href="/checkout"
                                        colorTheme="blue"
                                        fullWidth
                                        className="mt-2 font-extrabold uppercase tracking-widest text-sm"
                                        icon={<ArrowRight className="w-5 h-5 text-white" />}
                                        iconPosition="right"
                                    >
                                        Lanjut Pembayaran
                                    </FlatButton>

                                    <div className="mt-4 text-center">
                                        <span className="text-xs font-bold text-emerald-500">
                                            Anda hemat Rp {totalDiscount.toLocaleString('id-ID')} dalam pesanan ini
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
                                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                                    Pembayaran aman. 100% Bergaransi.
                                </div>

                                {/* Bottom Thick Border */}
                                <div className="h-2.5 w-full bg-indigo-800"></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Coupon Selection Modal */}
                {isCouponModalOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800">Pilih Kupon Diskon</h3>
                                <button
                                    onClick={() => setIsCouponModalOpen(false)}
                                    className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 focus:outline-none transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 bg-slate-100/70 relative">
                                {isLoadingRecommendations ? (
                                    <>
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="border border-slate-200 rounded-2xl p-4 flex justify-between items-center bg-white h-28">
                                                <div className="space-y-3 w-full">
                                                    <Skeleton className="h-6 w-32 rounded" />
                                                    <Skeleton className="h-4 w-48 rounded" />
                                                    <Skeleton className="h-3 w-24 rounded" />
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    availableCoupons.length > 0 ? (
                                        availableCoupons.map((coupon) => (
                                            <CouponCard
                                                key={coupon.code}
                                                coupon={coupon}
                                                onClick={handleApplyCoupon}
                                            />
                                        ))
                                    ) : (
                                        <EmptyCoupon />
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
