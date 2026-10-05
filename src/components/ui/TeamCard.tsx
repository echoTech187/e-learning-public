import React from 'react';

export interface TeamCardProps {
  name: string;
  role: string;
  initials: string;
  color: string;
}

export const TeamCard: React.FC<TeamCardProps> = ({ name, role, initials, color }) => {
  return (
    <div className="team-card text-center">
      <div className="team-avatar" style={{ background: `${color}22`, color: color }}>
        {initials}
      </div>
      <h4>{name}</h4>
      <p>{role}</p>
    </div>
  );
};
