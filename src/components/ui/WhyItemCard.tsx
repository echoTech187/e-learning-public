import React from 'react';

export interface WhyItemCardProps {
  title: string;
  description: string;
  icon: string;
}

export const WhyItemCard: React.FC<WhyItemCardProps> = ({ title, description, icon }) => {
  return (
    <div className="why-item">
      <div className="why-icon"><i className={`fas ${icon}`}></i></div>
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
};
