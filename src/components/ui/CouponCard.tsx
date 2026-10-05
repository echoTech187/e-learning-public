"use client";

import React from 'react';
import { Ticket } from 'lucide-react';

export interface CouponModel {
    code: string;
    discount_amount: number | string;
    discount_type: string;
    valid_until?: string;
    [key: string]: any;
}

interface CouponCardProps {
    coupon: CouponModel;
    onClick?: (coupon: CouponModel) => void;
}

export function CouponCard({ coupon, onClick }: CouponCardProps) {
    const isPercentage = coupon.discount_type === 'percentage';
    const amount = parseFloat(coupon.discount_amount.toString());
    const title = isPercentage ? `${amount}% Off` : `Rp ${amount.toLocaleString('id-ID')}`;
    const date = new Date(coupon.valid_until || Date.now()).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <div 
            className="cursor-pointer group hover:-translate-y-1 transition-transform duration-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] w-full"
            onClick={() => onClick && onClick(coupon)}
        >
            <div 
                className="w-full bg-white py-3 px-8 flex items-center justify-between shadow-sm"
                style={{
                    WebkitMaskImage: 'radial-gradient(circle 16px at 0 50%, transparent 16px, black 17px), radial-gradient(circle 16px at 100% 50%, transparent 16px, black 17px)',
                    WebkitMaskSize: '51% 100%',
                    WebkitMaskPosition: 'left, right',
                    WebkitMaskRepeat: 'no-repeat',
                }}
            >
                {/* Left Side (Content) */}
                <div className="flex flex-col">
                    <h4 className="text-[28px] font-extrabold text-[#1a2b4b] mb-1 tracking-tight leading-tight">
                        {title}
                    </h4>
                    <p className="text-[14px] font-medium text-slate-500 mb-3">
                        Kode: <span className="font-bold text-indigo-600">{coupon.code}</span>
                    </p>
                    <div className="text-[12px] font-medium text-slate-400">
                        Berlaku hingga {date}
                    </div>
                </div>
                
                {/* Right Side (Graphic) */}
                <div className="relative shrink-0 ml-4">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl rotate-[15deg] group-hover:rotate-6 transition-transform duration-300 flex items-center justify-center relative z-10">
                        <Ticket className="w-16 h-16 text-gray-200 -rotate-[15deg] group-hover:-rotate-6 transition-transform duration-300" strokeWidth={2} />
                    </div>
                </div>
            </div>
        </div>
    );
}
