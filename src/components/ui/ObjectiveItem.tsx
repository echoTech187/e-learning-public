import React from 'react';

export interface ObjectiveItemProps {
  title: string;
}

export const ObjectiveItem: React.FC<ObjectiveItemProps> = ({ title }) => {
  return (
    <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-indigo-100 transition">
      <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-xs">
        <i className="fas fa-check"></i>
      </div>
      <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
        {title}
      </span>
    </div>
  );
};
