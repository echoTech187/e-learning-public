import React from 'react';

export interface TestimonialCardProps {
  name: string;
  initials: string;
  role: string;
  rating: number;
  text: string;
  color: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  initials,
  role,
  rating,
  text,
  color
}) => {
  return (
    <div className="testimonial-card animate-on-scroll h-100">
      <div className="testi-stars">
        {Array.from({ length: rating }).map((_, i) => (
          <i key={i} className="fas fa-star text-warning"></i>
        ))}
      </div>
      <p className="testi-text">&quot;{text}&quot;</p>
      <div className="testi-author">
        <div className="testi-avatar" style={{ background: `${color}22`, color: color }}>
          {initials}
        </div>
        <div>
          <strong>{name}</strong>
          <small>{role}</small>
        </div>
      </div>
    </div>
  );
};
