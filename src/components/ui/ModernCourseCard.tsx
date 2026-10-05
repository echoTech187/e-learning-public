"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCourseThumbnail } from '@/core/utils/imageHelper';
import { PillButton } from './PillButton';

export interface ModernCourseCardProps {
  course: {
    id: string | number;
    slug: string;
    thumbnail: string;
    title: string;
    category: string;
    rating: number | string;
    level: string;
    students: number;
    price: number | string;
  };
  isEnrolled?: boolean;
  onBuyNow?: (e: React.MouseEvent, course: any) => void;
}

export const ModernCourseCard: React.FC<ModernCourseCardProps> = ({
  course,
  isEnrolled = false,
  onBuyNow,
}) => {
  const router = useRouter();
  
  return (
    <div onClick={() => router.push(`/kursus/${course.slug}`)} className="course-card h-100 d-flex flex-column position-relative" style={{ borderRadius: '24px', border: 'none', background: '#fff', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', cursor: 'pointer' }}>
      <div className="course-thumb position-relative" style={{ height: '260px', width: '100%' }}>
        <img src={getCourseThumbnail(course.thumbnail)} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <span className="position-absolute" style={{ top: '16px', right: '16px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: '#fff', padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: 600 }}>{course.category}</span>
      </div>

      <div className="position-absolute d-flex flex-column justify-content-center align-items-center" style={{ top: '220px', left: '24px', width: '64px', height: '64px', background: '#fff', borderRadius: '50%', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', color: '#1e293b', zIndex: 10, transform: 'translateY(-50%)' }}>
        <i className="fas fa-star text-warning" style={{ fontSize: '14px', marginBottom: '2px' }}></i>
        <span style={{ fontSize: '13px', fontWeight: 800, lineHeight: 1 }}>{course.rating}</span>
      </div>

      <div className="course-body position-relative d-flex flex-column flex-grow-1" style={{ background: '#ffffff', borderRadius: '24px 24px 0 0', marginTop: '-40px', padding: '44px 24px 24px', zIndex: 2, WebkitMaskImage: 'radial-gradient(circle at 56px 0px, transparent 40px, black 41px)', maskImage: 'radial-gradient(circle at 56px 0px, transparent 40px, black 41px)' }}>
        <h3 className="course-title mb-2" style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.4 }}>
          <Link href={`/kursus/${course.slug}`} className="text-dark text-decoration-none" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {course.title}
          </Link>
        </h3>
        
        <div className="d-flex align-items-center mb-4" style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>
          <span className="text-muted">Level</span> <span className="text-dark fw-bold ms-1">{course.level}</span>
          <span className="mx-2 text-gray-300">•</span>
          <i className="far fa-user me-1 text-muted"></i> <span className="text-muted">{Number(course.students).toLocaleString('id-ID')} Siswa</span>
        </div>
        
        <div className="mt-auto d-flex justify-content-between align-items-center">
          {isEnrolled ? (
            <PillButton 
              color="#10B981" 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push('/dashboard'); }}
            >
              Lanjutkan
            </PillButton>
          ) : (
            <PillButton 
              color="#F43F5E" 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (onBuyNow) onBuyNow(e, course); 
              }}
            >
              Beli Sekarang
            </PillButton>
          )}
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e293b' }}>
            Rp {Number(course.price).toLocaleString('id-ID')}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ModernCourseCardSkeleton: React.FC = () => {
  return (
    <div className="course-card h-100 position-relative" style={{ borderRadius: '24px', border: 'none', background: '#fff', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
      <div className="sk-shimmer" style={{ height: '260px', width: '100%' }}></div>
      <div className="position-absolute sk-shimmer" style={{ top: '220px', left: '24px', width: '64px', height: '64px', borderRadius: '50%', zIndex: 10, transform: 'translateY(-50%)' }}></div>
      <div className="course-body position-relative d-flex flex-column flex-grow-1" style={{ background: '#ffffff', borderRadius: '24px 24px 0 0', marginTop: '-40px', padding: '44px 24px 24px', zIndex: 2, WebkitMaskImage: 'radial-gradient(circle at 56px 0px, transparent 40px, black 41px)', maskImage: 'radial-gradient(circle at 56px 0px, transparent 40px, black 41px)' }}>
        <div className="sk-shimmer mb-2" style={{ height: 20, width: "90%", borderRadius: 4 }}></div>
        <div className="sk-shimmer mb-4" style={{ height: 20, width: "60%", borderRadius: 4 }}></div>
        <div className="d-flex gap-2 mb-4">
          <div className="sk-shimmer" style={{ height: 14, width: "30%", borderRadius: 4 }}></div>
          <div className="sk-shimmer" style={{ height: 14, width: "30%", borderRadius: 4 }}></div>
        </div>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <div className="sk-shimmer" style={{ height: 32, width: "45%", borderRadius: 99 }}></div>
          <div className="sk-shimmer" style={{ height: 20, width: "30%", borderRadius: 4 }}></div>
        </div>
      </div>
    </div>
  );
};
