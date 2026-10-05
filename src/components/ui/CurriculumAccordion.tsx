"use client";

import React, { useState } from 'react';
import { ContentCard } from './ContentCard';
import { SectionHeader } from './SectionHeader';

export interface CurriculumLesson {
  id: string;
  title: string;
  duration: string;
  is_preview?: boolean;
}

export interface CurriculumSection {
  id: string;
  title: string;
  totalDuration: string;
  items: CurriculumLesson[];
}

export interface CurriculumAccordionProps {
  curricula: CurriculumSection[];
  onPreview?: (title: string) => void;
  totalLessons?: number;
  totalDuration?: string;
}

export const CurriculumAccordion: React.FC<CurriculumAccordionProps> = ({
  curricula = [],
  onPreview,
  totalLessons,
  totalDuration
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    if (curricula && curricula.length > 0) {
      return { [curricula[0].id]: true };
    }
    return {};
  });

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAllSections = () => {
    const isAllOpen = curricula.every(sec => openSections[sec.id]);
    if (isAllOpen) {
      setOpenSections({});
    } else {
      const allOpen = curricula.reduce((acc, curr) => ({ ...acc, [curr.id]: true }), {});
      setOpenSections(allOpen);
    }
  };

  const isAllOpen = curricula.length > 0 && curricula.every(sec => openSections[sec.id]);

  const displayTotalLessons = totalLessons ?? curricula.reduce((acc, curr) => acc + (curr.items?.length || 0), 0);

  return (
    <ContentCard>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-0 pb-4 border-b border-slate-100">
        <div>
          <SectionHeader title="Kurikulum & Materi Pembelajaran" icon="fa-layer-group" className="mb-1" />
          <p className="text-xs text-slate-500 font-medium mt-1">
            {curricula.length} Bagian • {displayTotalLessons} Materi Pelajaran • Total Durasi {totalDuration || '-'}
          </p>
        </div>
        <button
          onClick={toggleAllSections}
          className="self-start sm:self-auto text-xs font-bold text-primary hover:text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/80 px-3.5 py-1.5 rounded-full transition border-0"
        >
          {isAllOpen ? "Tutup Semua Bagian" : "Buka Semua Bagian"}
        </button>
      </div>

      {/* Accordion Rows */}
      <div className="space-y-3">
        {curricula.map((section, secIdx) => {
          const isOpen = !!openSections[section.id];
          return (
            <div
              key={section.id || secIdx}
              className="rounded-2xl overflow-hidden mb-3"
            >
              {/* Section Header Button */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 sm:px-5 text-start bg-slate-100 hover:bg-slate-200/60 transition-colors border-0"
              >
                <div className="flex items-center gap-3.5 min-w-0 pr-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] transition-all duration-300 flex-shrink-0 ${isOpen ? "bg-indigo-500 text-white rotate-90" : "bg-white text-slate-400 shadow-sm"}`}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {section.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 text-xs">
                  <span className="text-[11px] font-bold text-indigo-500">
                    {section.items?.length || 0} Materi
                  </span>
                  <span className="text-slate-400 font-medium text-[11px] hidden sm:inline">
                    {section.totalDuration}
                  </span>
                </div>
              </button>

              {/* Section Lessons List */}
              <div className={`transition-all duration-300 ease-in-out overflow-hidden bg-white ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-2 sm:px-4 py-3 space-y-1">
                  {section.items && section.items.map((item, itemIdx) => (
                    <div
                      key={item.id || itemIdx}
                      className="flex items-center justify-between py-3 px-3 hover:bg-slate-50 rounded-xl transition-colors group cursor-pointer"
                      onClick={() => item.is_preview && onPreview && onPreview(item.title)}
                    >
                      <div className="flex items-center gap-4 min-w-0 pr-3">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] flex-shrink-0 transition-colors ${item.is_preview ? 'bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-indigo-50 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white'}`}>
                          <i className={`fas ${item.is_preview ? 'fa-play' : 'fa-lock'}`}></i>
                        </div>
                        <span className="text-xs sm:text-sm text-slate-600 font-semibold truncate group-hover:text-slate-900 transition-colors">
                          {item.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        {item.is_preview && (
                          <span className="text-[10px] font-bold text-emerald-500">
                            Pratinjau
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-medium w-10 text-right">
                          {item.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ContentCard>
  );
};
