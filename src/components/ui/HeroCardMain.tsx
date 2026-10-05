import React from 'react';

export interface HeroCardMainProps {
  name: string;
  role: string;
  initials: string;
  courseTitle: string;
  progress?: number | string;
  currentLesson?: string;
}

export const HeroCardMain: React.FC<HeroCardMainProps> = ({
  name,
  role,
  initials,
  courseTitle,
  progress = 0,
  currentLesson = ""
}) => {
  return (
    <div className="hero-card-main">
      <div className="hc-header">
        <div className="hc-avatar">{initials}</div>
        <div>
          <strong>{name}</strong>
          <small>{role}</small>
        </div>
        <span className="hc-badge">Online</span>
      </div>
      <div className="hc-progress-wrap">
        <div className="d-flex justify-content-between mb-1">
          <small>{courseTitle}</small>
          <small>{progress}%</small>
        </div>
        <div className="hc-progress-bar">
          <div className="hc-progress-fill" style={{ width: `${progress || 0}%` }}></div>
        </div>
      </div>
      <div className="hc-lesson">
        <i className="fas fa-play-circle text-primary"></i>
        <span>{currentLesson}</span>
      </div>
    </div>
  );
};
