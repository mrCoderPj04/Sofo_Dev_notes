'use client';

import React from 'react';

export default function Logo({ size = 'medium', showTagline = false, className = '' }) {
  const sizes = {
    small: { img: 'w-8 h-8', text: 'text-base', tagline: 'text-[9px]' },
    medium: { icon: 'w-10 h-10', img: 'w-10 h-10', text: 'text-xl', tagline: 'text-[10px]' },
    large: { img: 'w-16 h-16', text: 'text-3xl', tagline: 'text-xs' },
    hero: { img: 'w-24 h-24', text: 'text-5xl', tagline: 'text-sm' }
  };

  const currentSize = sizes[size] || sizes.medium;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Uploaded SOFO_dev Logo Image */}
      <div className={`relative ${currentSize.img} flex items-center justify-center rounded-full overflow-hidden p-[2px] bg-gradient-to-br from-cyan-500/30 via-purple-600/30 to-blue-500/30 shadow-cyan-glow transition-all duration-300 hover:scale-105 shrink-0`}>
        <img
          src="/SOFOdev.png"
          alt="SOFO DevNotes Logo"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      {/* Brand Name & Tagline */}
      <div className="flex flex-col">
        <div className={`font-extrabold tracking-tight ${currentSize.text} flex items-center gap-1.5`}>
          <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]">
            SOFO
          </span>
          <span className="text-white font-medium">DevNotes</span>
        </div>

        {(showTagline || size === 'hero' || size === 'large') && (
          <div className={`font-semibold tracking-widest text-cyan-400/80 uppercase ${currentSize.tagline} flex items-center gap-1.5 mt-0.5`}>
            <span>Learn</span>
            <span className="text-purple-400">•</span>
            <span>Code</span>
            <span className="text-cyan-400">•</span>
            <span>Store</span>
            <span className="text-purple-400">•</span>
            <span>Build</span>
          </div>
        )}
      </div>
    </div>
  );
}
