"use client";

import React, { useRef, useEffect } from 'react';

export interface CustomSelectProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  isOpen: boolean;
  onToggle: (e?: React.MouseEvent) => void;
  onClose: () => void;
  placeholder?: string;
  containerClassName?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  isOpen,
  onToggle,
  onClose,
  placeholder = "Pilih opsi...",
  containerClassName = ""
}) => {
  const selectRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className={`relative ${containerClassName}`} ref={selectRef}>
      <button 
        onClick={(e) => { 
          e.preventDefault(); 
          onToggle(e);
        }} 
        className="w-full flex justify-between items-center bg-white border border-gray-200 hover:border-indigo-300 transition-colors outline-none text-left" 
        type="button" 
        style={{ borderRadius: '12px', height: '44px', fontSize: '14px', padding: '0 20px', color: '#1A1830' }}
      >
        <span className="truncate font-medium">{value || placeholder}</span>
        <i className={`fas fa-chevron-down text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`}></i>
      </button>
      
      {isOpen && (
        <ul className="absolute z-50 w-full bg-white border border-gray-200 shadow-lg mt-2 py-2 list-none transform opacity-100 scale-100 transition-all origin-top" style={{ borderRadius: '12px', maxHeight: '280px', overflowY: 'auto' }}>
          {options.map((opt, i) => (
            <li key={i}>
              <div
                className={`w-full text-left py-2 px-4 cursor-pointer transition-colors ${value === opt ? 'text-primary fw-bold' : 'text-secondary hover:bg-gray-50'}`}
                style={{ fontSize: '14px' }}
                onClick={() => { 
                  onChange(opt); 
                  onClose(); 
                }}
              >
                {opt}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
