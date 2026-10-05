import React from 'react';

export interface ContentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: string;
}

export const ContentCard: React.FC<ContentCardProps> = ({ 
  children, 
  className = "", 
  padding = "p-5",
  ...props 
}) => {
  return (
    <div 
      className={`bg-white border-0 ${padding} ${className}`} 
      style={{ borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)' }}
      {...props}
    >
      {children}
    </div>
  );
};
