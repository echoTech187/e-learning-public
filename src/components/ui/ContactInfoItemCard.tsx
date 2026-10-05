import React from 'react';

export interface ContactInfoItemCardProps {
  title: string;
  value: React.ReactNode;
  icon: string;
  bgColor: string;
  color: string;
}

export const ContactInfoItemCard: React.FC<ContactInfoItemCardProps> = ({ title, value, icon, bgColor, color }) => {
  return (
    <div className="contact-info-item">
      <div className="ci-icon" style={{ background: bgColor, color: color }}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <strong>{title}</strong>
        <p>{value}</p>
      </div>
    </div>
  );
};
