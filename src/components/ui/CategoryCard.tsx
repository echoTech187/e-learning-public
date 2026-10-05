import React from 'react';
import Link from 'next/link';

export interface CategoryCardProps {
  name: string;
  icon: string;
  color: string;
  count: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ name, icon, color, count }) => {
  return (
    <Link href={`/kursus?kategori=${encodeURIComponent(name)}`} className="category-card animate-on-scroll">
      <div className="cat-icon" style={{ background: `${color}22`, color: color }}>
        <i className={icon}></i>
      </div>
      <h3>{name}</h3>
      <span>{count} Kursus</span>
    </Link>
  );
};
