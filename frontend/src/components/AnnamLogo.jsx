import React from 'react';

export const AnnamLogo = ({ size = 'md', variant = 'light', showText = true, subtitle = 'GREEN FAMILY' }) => {
  // size: 'sm' | 'md' | 'lg' | 'xl'
  // variant: 'light' (for dark backgrounds) | 'dark' (for light backgrounds) | 'flat'

  const sizeDimensions = {
    sm: { container: 'w-8 h-8', svg: 'w-5 h-5', title: 'text-base font-bold', sub: 'text-[9px]' },
    md: { container: 'w-10 h-10', svg: 'w-6 h-6', title: 'text-xl font-extrabold', sub: 'text-[10px]' },
    lg: { container: 'w-16 h-16', svg: 'w-10 h-10', title: 'text-3xl font-extrabold', sub: 'text-xs' },
    xl: { container: 'w-24 h-24', svg: 'w-14 h-14', title: 'text-4xl font-black', sub: 'text-xs' }
  }[size] || { container: 'w-10 h-10', svg: 'w-6 h-6', title: 'text-xl font-extrabold', sub: 'text-[10px]' };

  return (
    <div className="inline-flex items-center gap-3 select-none">
      {/* Round Emblem Badge */}
      <div className={`${sizeDimensions.container} rounded-full bg-[#fdf8ee] shadow-sm flex items-center justify-center border border-[#e4eedf] shrink-0 relative overflow-hidden transition-transform duration-300 hover:scale-105`}>
        <svg viewBox="0 0 40 40" className={`${sizeDimensions.svg} fill-none`} xmlns="http://www.w3.org/2000/svg">
          {/* Top sprout leaf */}
          <path 
            d="M20 7 C 20 7 24 10 24 14 C 21 14 19 12 20 7 Z" 
            fill="#15803d" 
          />
          <path 
            d="M19 8 C 19 8 16 11 16 14 C 18.5 14.5 19.5 12 19 8 Z" 
            fill="#22c55e" 
          />
          {/* Outer green bowl / avocado outline */}
          <path 
            d="M20 14 C 27 14 31 19 31 25 C 31 31.5 26 35 20 35 C 14 35 9 31.5 9 25 C 9 19 13 14 20 14 Z" 
            fill="#15803d" 
          />
          <path 
            d="M20 16.5 C 25.5 16.5 28.5 20.5 28.5 25.2 C 28.5 30 24.5 32.8 20 32.8 C 15.5 32.8 11.5 30 11.5 25.2 C 11.5 20.5 14.5 16.5 20 16.5 Z" 
            fill="#fdfbf7" 
          />
          {/* Heart / golden seed */}
          <path 
            d="M20 22 C 22 19.5 25 21 24.5 23.5 C 24 25.5 20 29 20 29 C 20 29 16 25.5 15.5 23.5 C 15 21 18 19.5 20 22 Z" 
            fill="#f59e0b" 
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`${sizeDimensions.title} tracking-tight ${variant === 'light' ? 'text-white' : 'text-[#0f3825]'}`}>
            Annam
          </span>
          {subtitle && (
            <span className={`${sizeDimensions.sub} font-black tracking-widest uppercase ${variant === 'light' ? 'text-emerald-300' : 'text-emerald-700'}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
