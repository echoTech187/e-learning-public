import React from 'react';
import { Ticket } from 'lucide-react';

export function EmptyCoupon() {
    return (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-white rounded-xl border border-dashed border-slate-200 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 shadow-inner">
                <Ticket className="w-8 h-8 text-slate-300" strokeWidth={1.5} />
            </div>
            <h4 className="text-sm font-bold text-slate-700 mb-1">
                Belum Ada Kupon
            </h4>
            <p className="text-xs font-medium text-slate-500 max-w-[250px]">
                Saat ini belum ada kupon atau promo yang tersedia untuk akun Anda.
            </p>
        </div>
    );
}
