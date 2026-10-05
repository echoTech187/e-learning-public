import React from 'react';

export interface HeroCardFloatProps {
  title?: string;
  subtitle?: string;
  icon: string;
  iconColorClass?: string;
  className?: string;
}

export const HeroCardFloat: React.FC<HeroCardFloatProps> = ({
  title = "",
  subtitle = "",
  icon,
  iconColorClass = "text-warning",
  className = ""
}) => {
  return (
    <div className={`hero-card-float ${className}`.trim()}>
      <i className={`fas ${icon} ${iconColorClass}`}></i>
      <div>
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </div>
    </div>
  );
};
