"use client";

import React from 'react';

export interface SimpleHeroProps {
  badgeText?: string;
  badgeIcon?: string;
  title: React.ReactNode;
  description: React.ReactNode;
}

export const SimpleHero: React.FC<SimpleHeroProps> = ({
  badgeText,
  badgeIcon = "fas fa-layer-group text-warning",
  title,
  description
}) => {
  return (
    <section className="page-hero-simple">
      <div className="hero-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <div className="container text-center">
        {badgeText && (
          <div className="section-badge">
            {badgeIcon && <i className={`${badgeIcon} me-2`}></i>}
            {badgeText}
          </div>
        )}
        <h1 className="section-title">
          {title}
        </h1>
        <p className="text-muted mx-auto" style={{ maxWidth: '500px' }}>
          {description}
        </p>
      </div>
    </section>
  );
};
