import React from 'react';

export interface FeaturePillarProps {
  title: string;
  description: string;
  icon: string;
  colorTheme?: 'indigo' | 'emerald' | 'amber' | 'slate' | 'blue' | 'rose';
}

const colorMaps = {
  indigo: {
    bg: 'bg-indigo-50/40',
    border: 'border-indigo-100/60',
    iconBg: 'bg-indigo-100',
    iconText: 'text-primary',
  },
  emerald: {
    bg: 'bg-emerald-50/40',
    border: 'border-emerald-100/60',
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-700',
  },
  amber: {
    bg: 'bg-amber-50/40',
    border: 'border-amber-100/60',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-700',
  },
  slate: {
    bg: 'bg-slate-50/70',
    border: 'border-slate-100',
    iconBg: 'bg-slate-100',
    iconText: 'text-slate-600',
  },
  blue: {
    bg: 'bg-blue-50/40',
    border: 'border-blue-100/60',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-700',
  },
  rose: {
    bg: 'bg-rose-50/40',
    border: 'border-rose-100/60',
    iconBg: 'bg-rose-100',
    iconText: 'text-rose-700',
  }
};

export const FeaturePillar: React.FC<FeaturePillarProps> = ({
  title,
  description,
  icon,
  colorTheme = 'indigo'
}) => {
  const theme = colorMaps[colorTheme] || colorMaps.indigo;

  return (
    <div className={`p-3.5 rounded-2xl ${theme.bg} border ${theme.border} flex items-start gap-3`}>
      <div className={`w-7 h-7 rounded-lg ${theme.iconBg} ${theme.iconText} flex items-center justify-center text-xs flex-shrink-0 font-bold`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <h4 className="text-xs font-bold text-slate-900">{title}</h4>
        <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
};
