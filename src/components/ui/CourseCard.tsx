import React from 'react';
import Link from 'next/link';
import { Card } from './Card';
import { Badge } from './Badge';
import { getCourseThumbnail } from '@/core/utils/imageHelper';

interface CourseCardProps {
  course: {
    id: string;
    slug: string;
    title: string;
    thumbnail?: string;
    instructor_name: string;
    price_formatted: string;
    is_new?: boolean;
    category?: string;
  };
  onClickAction?: React.ReactNode;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onClickAction,
  className = '',
}) => {
  return (
    <Card 
      variant="interactive" 
      padding="none" 
      radius="xl"
      className={`group flex flex-col h-full bg-white ${className}`}
    >
      <div className="relative">
        <Link href={`/kursus/${course.slug}`} className="block overflow-hidden">
          <div 
            className="w-full aspect-[4/3] bg-slate-100 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
            style={{ backgroundImage: `url(${getCourseThumbnail(course.thumbnail || '')})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {course.is_new && (
            <Badge colorTheme="teal" variant="solid" size="sm">
              Baru
            </Badge>
          )}
          {course.category && (
            <Badge colorTheme="indigo" variant="soft" size="sm" className="backdrop-blur-md bg-white/90">
              {course.category}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <div className="flex-1">
          <Link href={`/kursus/${course.slug}`}>
            <h3 className="font-bold text-[16px] sm:text-[18px] text-slate-800 mb-2 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
              {course.title}
            </h3>
          </Link>
          <p className="text-[13px] sm:text-[14px] text-slate-500 font-medium line-clamp-1 mb-4">
            Mentor: <span className="text-slate-700">{course.instructor_name}</span>
          </p>
        </div>
        
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="font-extrabold text-[#e76e54] text-[16px] sm:text-[18px] tracking-tight">
            {course.price_formatted}
          </div>
          {onClickAction && (
            <div className="shrink-0">
              {onClickAction}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
