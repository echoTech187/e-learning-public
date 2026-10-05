import React from 'react';

export interface ReviewCardProps {
  name: string;
  initials: string;
  date: string;
  rating: number;
  comment: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ name, initials, date, rating, comment }) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs"
            style={{ background: "linear-gradient(135deg, #6366F1 0%, #4338CA 100%)" }}
          >
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">{name}</h4>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <i className="fas fa-check-circle text-[9px] me-0.5"></i> Pembeli Terverifikasi
              </span>
            </div>
            <span className="text-[11px] text-slate-400">{date}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-amber-400 text-xs">
          {Array.from({ length: rating }).map((_, i) => (
            <i key={i} className="fas fa-star"></i>
          ))}
        </div>
      </div>
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        &quot;{comment}&quot;
      </p>
    </div>
  );
};
