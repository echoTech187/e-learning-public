import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  colorTheme?: 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate' | 'teal';
  variant?: 'soft' | 'solid' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  colorTheme = 'indigo',
  variant = 'soft',
  size = 'md',
  className = '',
  icon,
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-wide uppercase rounded-full transition-colors';
  
  const sizeStyles = {
    sm: 'text-[9px] sm:text-[10px] px-2 py-0.5 gap-1',
    md: 'text-[10px] sm:text-[11px] px-2.5 py-1 gap-1.5',
  };

  const themeStyles = {
    indigo: {
      soft: 'bg-indigo-50 text-indigo-600',
      solid: 'bg-indigo-500 text-white shadow-sm',
      outline: 'border border-indigo-200 text-indigo-600',
    },
    emerald: {
      soft: 'bg-emerald-50 text-emerald-600',
      solid: 'bg-emerald-500 text-white shadow-sm',
      outline: 'border border-emerald-200 text-emerald-600',
    },
    rose: {
      soft: 'bg-rose-50 text-rose-600',
      solid: 'bg-rose-500 text-white shadow-sm',
      outline: 'border border-rose-200 text-rose-600',
    },
    amber: {
      soft: 'bg-amber-50 text-amber-600',
      solid: 'bg-amber-500 text-white shadow-sm',
      outline: 'border border-amber-200 text-amber-600',
    },
    slate: {
      soft: 'bg-slate-100 text-slate-600',
      solid: 'bg-slate-700 text-white shadow-sm',
      outline: 'border border-slate-200 text-slate-600',
    },
    teal: {
      soft: 'bg-[#4cb5a4]/10 text-[#4cb5a4]',
      solid: 'bg-[#4cb5a4] text-white shadow-sm',
      outline: 'border border-[#4cb5a4]/30 text-[#4cb5a4]',
    }
  };

  const style = themeStyles[colorTheme][variant];

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${style} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
