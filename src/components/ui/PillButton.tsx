"use client";

import React from 'react';

export interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string;
  textColor?: string;
  dotColor?: string;
  showDot?: boolean;
}

export const PillButton: React.FC<PillButtonProps> = ({
  color = '#F43F5E',
  textColor = 'white',
  dotColor = 'white',
  showDot = true,
  children,
  className = '',
  style,
  ...props
}) => {
  return (
    <button 
      className={`btn d-flex align-items-center gap-2 ${className}`} 
      style={{ 
        background: color, 
        color: textColor, 
        borderRadius: '99px', 
        fontWeight: 700, 
        padding: '6px 14px', 
        fontSize: '11px', 
        border: 'none', 
        textTransform: 'uppercase',
        ...style 
      }}
      {...props}
    >
      {showDot && (
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: dotColor }}></div>
      )}
      {children}
    </button>
  );
};
