import React from 'react';

interface SectionHeaderProps {
  title: React.ReactNode;
  badge?: string;
  icon?: string;
  size?: 'sm' | 'md' | 'lg' | string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  align?: 'center' | 'left' | 'right';
  titleClassName?: string;
}

export function SectionHeader({
  title,
  badge,
  icon,
  size,
  className = '',
  as = 'h2',
  align,
  titleClassName = ''
}: SectionHeaderProps) {
  const TitleTag = as;
  
  if (icon) {
    const isSm = size === 'sm';
    return (
      <div className={`flex items-center gap-2 mb-4 ${className}`.trim()}>
        <div className={`flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 ${isSm ? 'w-8 h-8' : 'w-10 h-10'}`}>
          <i className={`fas ${icon} ${isSm ? 'text-sm' : 'text-base'}`}></i>
        </div>
        <TitleTag className={`font-bold text-slate-800 ${isSm ? 'text-base' : 'text-lg sm:text-xl'} ${titleClassName}`.trim()}>
          {title}
        </TitleTag>
      </div>
    );
  }
  
  let alignmentClass = '';
  if (align === 'center') alignmentClass = 'text-center';
  else if (align === 'right') alignmentClass = 'text-end';
  else if (align === 'left') alignmentClass = 'text-start';

  return (
    <div className={`section-header ${alignmentClass} ${className}`.trim()}>
      {badge && <div className="section-badge">{badge}</div>}
      <TitleTag className={`section-title ${titleClassName}`.trim()}>{title}</TitleTag>
    </div>
  );
}
