import React from 'react';
import Link from 'next/link';

export type FlatButtonVariant = 'solid' | 'white' | 'soft';
export type FlatButtonColor = 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'teal' | 'orange' | 'slate';
export type FlatButtonIconPosition = 'left' | 'right';
export type FlatButtonSize = 'sm' | 'md' | 'lg';

export interface FlatButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: FlatButtonVariant;
  colorTheme?: FlatButtonColor;
  icon?: React.ReactNode;
  iconPosition?: FlatButtonIconPosition;
  size?: FlatButtonSize;
  fullWidth?: boolean;
  noShadow?: boolean;
  href?: string;
}

const colorMaps: Record<FlatButtonColor, { solid: string, solidIcon: string, white: string, whiteIcon: string }> = {
  blue: {
    solid: 'bg-gradient-to-br from-[#6C47FF] to-[#8B5CF6] text-white hover:shadow-[0_10px_30px_rgba(108,71,255,0.4)] hover:-translate-y-[3px] active:translate-y-0 active:shadow-none',
    solidIcon: 'bg-white/15 backdrop-blur-sm',
    white: 'bg-white text-[#6C47FF] border-2 border-slate-100 hover:border-[#6C47FF] hover:-translate-y-[3px] hover:shadow-[0_10px_30px_rgba(108,71,255,0.15)] active:translate-y-0',
    whiteIcon: 'bg-gradient-to-br from-[#6C47FF] to-[#8B5CF6] text-white'
  },
  red: {
    solid: 'bg-gradient-to-br from-[#EF4444] to-[#F87171] text-white hover:shadow-[0_10px_30px_rgba(239,68,68,0.4)] hover:-translate-y-[3px] active:translate-y-0 active:shadow-none',
    solidIcon: 'bg-white/15 backdrop-blur-sm',
    white: 'bg-white text-[#EF4444] border-2 border-slate-100 hover:border-[#EF4444] hover:-translate-y-[3px] hover:shadow-[0_10px_30px_rgba(239,68,68,0.15)] active:translate-y-0',
    whiteIcon: 'bg-gradient-to-br from-[#EF4444] to-[#F87171] text-white'
  },
  green: {
    solid: 'bg-gradient-to-br from-[#22C55E] to-[#4ADE80] text-white hover:shadow-[0_10px_30px_rgba(34,197,94,0.4)] hover:-translate-y-[3px] active:translate-y-0 active:shadow-none',
    solidIcon: 'bg-white/15 backdrop-blur-sm',
    white: 'bg-white text-[#22C55E] border-2 border-slate-100 hover:border-[#22C55E] hover:-translate-y-[3px] hover:shadow-[0_10px_30px_rgba(34,197,94,0.15)] active:translate-y-0',
    whiteIcon: 'bg-gradient-to-br from-[#22C55E] to-[#4ADE80] text-white'
  },
  yellow: {
    solid: 'bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] text-white hover:shadow-[0_10px_30px_rgba(245,158,11,0.4)] hover:-translate-y-[3px] active:translate-y-0 active:shadow-none',
    solidIcon: 'bg-white/15 backdrop-blur-sm',
    white: 'bg-white text-[#F59E0B] border-2 border-slate-100 hover:border-[#F59E0B] hover:-translate-y-[3px] hover:shadow-[0_10px_30px_rgba(245,158,11,0.15)] active:translate-y-0',
    whiteIcon: 'bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] text-white'
  },
  purple: {
    solid: 'bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] text-white hover:shadow-[0_10px_30px_rgba(139,92,246,0.4)] hover:-translate-y-[3px] active:translate-y-0 active:shadow-none',
    solidIcon: 'bg-white/15 backdrop-blur-sm',
    white: 'bg-white text-[#8B5CF6] border-2 border-slate-100 hover:border-[#8B5CF6] hover:-translate-y-[3px] hover:shadow-[0_10px_30px_rgba(139,92,246,0.15)] active:translate-y-0',
    whiteIcon: 'bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] text-white'
  },
  teal: {
    solid: 'bg-gradient-to-br from-[#00C4B8] to-[#2DD4BF] text-white hover:shadow-[0_10px_30px_rgba(0,196,184,0.4)] hover:-translate-y-[3px] active:translate-y-0 active:shadow-none',
    solidIcon: 'bg-white/15 backdrop-blur-sm',
    white: 'bg-white text-[#00C4B8] border-2 border-slate-100 hover:border-[#00C4B8] hover:-translate-y-[3px] hover:shadow-[0_10px_30px_rgba(0,196,184,0.15)] active:translate-y-0',
    whiteIcon: 'bg-gradient-to-br from-[#00C4B8] to-[#2DD4BF] text-white'
  },
  orange: {
    solid: 'bg-gradient-to-br from-[#FF6B47] to-[#FB923C] text-white hover:shadow-[0_10px_30px_rgba(255,107,71,0.4)] hover:-translate-y-[3px] active:translate-y-0 active:shadow-none',
    solidIcon: 'bg-white/15 backdrop-blur-sm',
    white: 'bg-white text-[#FF6B47] border-2 border-slate-100 hover:border-[#FF6B47] hover:-translate-y-[3px] hover:shadow-[0_10px_30px_rgba(255,107,71,0.15)] active:translate-y-0',
    whiteIcon: 'bg-gradient-to-br from-[#FF6B47] to-[#FB923C] text-white'
  },
  slate: {
    solid: 'bg-gradient-to-br from-[#475569] to-[#64748B] text-white hover:shadow-[0_10px_30px_rgba(71,85,105,0.4)] hover:-translate-y-[3px] active:translate-y-0 active:shadow-none',
    solidIcon: 'bg-white/15 backdrop-blur-sm',
    white: 'bg-white text-[#475569] border-2 border-slate-100 hover:border-[#475569] hover:-translate-y-[3px] hover:shadow-[0_10px_30px_rgba(71,85,105,0.15)] active:translate-y-0',
    whiteIcon: 'bg-gradient-to-br from-[#475569] to-[#64748B] text-white'
  }
};

export const FlatButton = React.forwardRef<HTMLButtonElement, FlatButtonProps>(
  ({ variant = 'solid', colorTheme = 'blue', size = 'md', fullWidth = false, noShadow = false, icon, iconPosition = 'left', href, children, className = '', style, ...props }, ref) => {
    const colorStyle = colorMaps[colorTheme] || colorMaps.blue;
    
    // Process colorStyle to remove shadow if noShadow is true
    const processedSolidClass = noShadow ? colorStyle.solid.replace(/shadow-\[[^\]]+\]/g, '').replace('active:shadow-none', '') : colorStyle.solid;
    const processedWhiteClass = noShadow ? colorStyle.white.replace(/shadow-\[[^\]]+\]/g, '').replace('active:shadow-[0_0px_0px_rgba(0,0,0,0.06)]', '') : colorStyle.white;
    
    const sizeClasses = {
      sm: {
        text: 'text-[10px] sm:text-[11px] tracking-wide',
        solidPadding: children ? 'px-3 py-1.5' : 'p-0',
        solidIcon: 'px-3',
        whitePadding: children ? (icon ? (iconPosition === 'left' ? 'pl-1 pr-4 py-1' : 'pr-1 pl-4 py-1') : 'px-4 py-2') : 'p-1',
        whiteIconBox: 'w-6 h-6',
        whiteMargin: 'mx-2'
      },
      md: {
        text: 'text-[13px] sm:text-[14px] tracking-widest',
        solidPadding: children ? 'py-3.5' : 'p-0',
        solidIcon: 'px-4 sm:px-5',
        whitePadding: children ? (icon ? (iconPosition === 'left' ? 'pl-1.5 pr-6 py-1.5' : 'pr-1.5 pl-6 py-1.5') : 'px-6 py-3') : 'p-1.5',
        whiteIconBox: 'w-9 h-9 sm:w-11 sm:h-11',
        whiteMargin: 'mx-3 sm:mx-4'
      },
      lg: {
        text: 'text-[15px] sm:text-[16px] tracking-widest',
        solidPadding: children ? 'py-4' : 'p-0',
        solidIcon: 'px-6',
        whitePadding: children ? (icon ? (iconPosition === 'left' ? 'pl-2 pr-8 py-2' : 'pr-2 pl-8 py-2') : 'px-8 py-4') : 'p-2',
        whiteIconBox: 'w-12 h-12',
        whiteMargin: 'mx-4'
      }
    };

    const s = sizeClasses[size];

    const containerClass = variant === 'solid' 
      ? `cursor-pointer flex items-stretch overflow-hidden rounded-xl font-bold uppercase transition-all duration-200 ${s.text} ${processedSolidClass} ${fullWidth ? 'w-full' : 'inline-flex'} whitespace-nowrap border-0 focus:outline-none outline-none ${noShadow ? 'shadow-none' : ''} ${className}`
      : `cursor-pointer flex items-center rounded-full font-bold uppercase transition-all duration-200 ${s.text} ${processedWhiteClass} ${fullWidth ? 'w-full justify-center' : 'inline-flex'} ${s.whitePadding} whitespace-nowrap border-0 focus:outline-none outline-none ${noShadow ? 'shadow-none' : ''} ${className}`;

    const renderSolidIcon = () => (
      <div className={`flex items-center justify-center shrink-0 ${s.solidIcon} ${colorStyle.solidIcon}`}>
        {icon}
      </div>
    );

    const renderWhiteIcon = () => (
      <div className={`flex items-center justify-center rounded-full shrink-0 ${s.whiteIconBox} ${colorStyle.whiteIcon}`}>
        {icon}
      </div>
    );

    const content = variant === 'solid' ? (
      <>
        {icon && iconPosition === 'left' && renderSolidIcon()}
        {children && (
          <div className={`flex items-center justify-center ${s.solidPadding} ${fullWidth ? 'flex-1' : ''}`}>
            {children}
          </div>
        )}
        {icon && iconPosition === 'right' && renderSolidIcon()}
      </>
    ) : (
      <>
        {icon && iconPosition === 'left' && (variant === 'white' ? renderWhiteIcon() : icon)}
        {children && <span className={icon ? s.whiteMargin : ''}>{children}</span>}
        {icon && iconPosition === 'right' && (variant === 'white' ? renderWhiteIcon() : icon)}
      </>
    );

    // Hardcoded styles for reliable rendering in production without CSS rebuilds
    const inlineStyles = variant === 'solid' ? {
        background: colorTheme === 'blue' ? 'linear-gradient(135deg, var(--primary, #6C47FF), #8B5CF6)' : 
                    colorTheme === 'red' ? 'linear-gradient(135deg, var(--danger, #EF4444), #F87171)' :
                    colorTheme === 'green' ? 'linear-gradient(135deg, var(--success, #22C55E), #4ADE80)' :
                    colorTheme === 'orange' ? 'linear-gradient(135deg, var(--secondary, #FF6B47), #FB923C)' :
                    colorTheme === 'purple' ? 'linear-gradient(135deg, #8B5CF6, #A78BFA)' :
                    colorTheme === 'teal' ? 'linear-gradient(135deg, #00C4B8, #2DD4BF)' :
                    'linear-gradient(135deg, #475569, #64748B)',
        boxShadow: noShadow ? 'none' : '0 10px 30px rgba(0,0,0,0.15)',
        color: '#fff'
    } : variant === 'soft' ? {
        background: colorTheme === 'red' ? 'rgba(239, 68, 68, 0.1)' :
                    colorTheme === 'blue' ? 'rgba(108, 71, 255, 0.1)' : 'rgba(0,0,0,0.05)',
        color: colorTheme === 'blue' ? '#6C47FF' : colorTheme === 'red' ? '#EF4444' : '#FF6B47'
    } : {
        background: '#ffffff',
        border: `2px solid ${colorTheme === 'blue' ? '#6C47FF' : colorTheme === 'red' ? '#EF4444' : '#FF6B47'}`,
        color: colorTheme === 'blue' ? '#6C47FF' : colorTheme === 'red' ? '#EF4444' : '#FF6B47'
    };

    const finalStyles = { ...inlineStyles, ...(style || {}) };

    if (href) {
      return (
        <Link href={href} className={containerClass} style={finalStyles}>
          {content}
        </Link>
      );
    }

    return (
      <button ref={ref} className={containerClass} style={finalStyles} {...props}>
        {content}
      </button>
    );
  }
);

FlatButton.displayName = 'FlatButton';
