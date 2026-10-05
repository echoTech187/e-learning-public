import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'interactive' | 'outline' | 'ghost' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'lg',
  radius = '2xl',
  className = '',
  ...props
}) => {
  // Late 2026 Design System - Bento aesthetics
  const baseStyles = 'bg-white relative overflow-hidden transition-all duration-300';
  
  const variants = {
    default: 'border border-slate-100 shadow-[0_8px_30px_rgba(108,71,255,0.06)]',
    interactive: 'border border-slate-100 shadow-[0_8px_30px_rgba(108,71,255,0.06)] hover:border-[#6C47FF]/30 hover:shadow-[0_20px_60px_rgba(108,71,255,0.12)] hover:-translate-y-[4px]',
    outline: 'border border-slate-200/60 hover:border-slate-300',
    ghost: 'hover:bg-slate-50',
    elevated: 'border border-white/80 shadow-[0_20px_60px_rgba(108,71,255,0.15)] bg-white/95 backdrop-blur-xl',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
    xl: 'p-8 sm:p-12',
  };

  const radiuses = {
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-[24px]',
    '2xl': 'rounded-[32px]',
    '3xl': 'rounded-[40px]',
  };

  const shadowStyle = variant === 'elevated' 
    ? { boxShadow: '0 20px 60px rgba(108,71,255,0.15)' } 
    : (variant === 'default' || variant === 'interactive' ? { boxShadow: '0 8px 30px rgba(108,71,255,0.06)' } : {});

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${radiuses[radius]} ${className}`}
      style={{ ...shadowStyle, ...(props.style || {}) }}
      {...props}
    >
      {children}
    </div>
  );
};
