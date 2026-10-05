"use client";

import React from 'react';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
  containerClassName?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  icon = "fas fa-search",
  containerClassName = "",
  className = "",
  style,
  ...props
}) => {
  return (
    <div className={`position-relative ${containerClassName}`}>
      <i className={`${icon} position-absolute top-50 start-0 translate-middle-y ms-4 text-gray-400`}></i>
      <input
        className={`form-control shadow-none w-100 bg-white border border-gray-200 transition-colors focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 ${className}`}
        style={{ 
          height: '44px', 
          borderRadius: '12px', 
          paddingLeft: '3.2rem', 
          fontSize: '14px',
          ...style
        }}
        {...props}
      />
    </div>
  );
};
