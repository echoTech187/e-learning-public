import React from 'react';

interface StatCardProps {
  value: React.ReactNode;
  label: string;
  variant?: 'default' | 'about';
  colorTheme?: 'primary' | 'orange' | 'green' | 'blue';
  accentColor?: string;
  className?: string;
}

export function StatCard({
  value,
  label,
  variant = 'default',
  colorTheme = 'primary',
  accentColor,
  className = ''
}: StatCardProps) {
  if (variant === 'about') {
    const style = accentColor ? { '--accent': accentColor } as React.CSSProperties : {};
    return (
      <div className={`about-stat-card ${className}`.trim()} style={style}>
        <div className="about-stat-num">{value}</div>
        <div className="about-stat-label">{label}</div>
      </div>
    );
  }

  return (
    <div className={`stat-card stat-${colorTheme} animate-on-scroll h-100 ${className}`.trim()}>
      <div className="stat-num">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
