import React from 'react';

export const IconHouse = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" y1="56" x2="60" y2="56" />
    {/* Left House */}
    <path d="M8 38 L22 24 L36 38" />
    <path d="M12 34 V56" />
    <path d="M32 34 V56" />
    <path d="M14 28 V18 H20 V22" />
    <rect x="18" y="44" width="8" height="12" />
    <circle cx="24" cy="50" r="1" />
    <rect x="28" y="36" width="8" height="8" />
    <path d="M32 36 V44 M28 40 H36" />
    {/* Right Building */}
    <path d="M36 42 V16 H50 V56" />
    <rect x="40" y="22" width="6" height="6" />
    <rect x="40" y="32" width="6" height="6" />
    <rect x="40" y="42" width="6" height="6" />
    {/* Tree */}
    <path d="M56 56 V36" />
    <ellipse cx="56" cy="26" rx="4" ry="10" />
  </svg>
);

export const IconFactory = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" y1="56" x2="60" y2="56" />
    {/* Main Building */}
    <path d="M8 56 V36 L16 28 V36 L24 28 V36 L32 28 V36 L40 28 V36 L56 36 V56" />
    {/* Smokestacks */}
    <path d="M12 28 V12 H18 V28" />
    <line x1="12" y1="16" x2="18" y2="16" />
    <path d="M22 28 V12 H28 V28" />
    <line x1="22" y1="16" x2="28" y2="16" />
    {/* Gear */}
    <circle cx="20" cy="46" r="6" />
    <path d="M20 38 V40 M20 52 V54 M12 46 H14 M26 46 H28 M15 41 L16.5 42.5 M23.5 49.5 L25 51 M15 51 L16.5 49.5 M23.5 42.5 L25 41" />
    {/* Garage Door */}
    <rect x="36" y="44" width="16" height="12" />
    <line x1="36" y1="48" x2="52" y2="48" />
    <line x1="36" y1="52" x2="52" y2="52" />
  </svg>
);

export const IconLand = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Sun */}
    <circle cx="18" cy="18" r="6" />
    <path d="M18 6 V9 M18 27 V30 M6 18 H9 M27 18 H30 M9.5 9.5 L11.5 11.5 M24.5 24.5 L26.5 26.5 M9.5 26.5 L11.5 24.5 M24.5 11.5 L26.5 9.5" />
    {/* Hills */}
    <path d="M4 48 Q 24 32 44 48" />
    <path d="M20 56 Q 40 36 60 56" />
    {/* Field Lines (Perspective) */}
    <path d="M12 42 L 24 56" />
    <path d="M20 38 L 36 56" />
    <path d="M28 36 L 48 56" />
    <path d="M36 40 L 56 56" />
    {/* Cross lines */}
    <path d="M16 48 Q 28 44 40 48" />
    <path d="M24 52 Q 36 48 48 52" />
    {/* Flag */}
    <path d="M50 46 V26 L58 30 L50 34" />
  </svg>
);

export const IconCar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" y1="56" x2="60" y2="56" />
    {/* Garage */}
    <path d="M36 56 V28 L48 20 L60 28 V56" />
    <rect x="40" y="36" width="16" height="20" />
    <line x1="40" y1="41" x2="56" y2="41" />
    <line x1="40" y1="46" x2="56" y2="46" />
    <line x1="40" y1="51" x2="56" y2="51" />
    {/* Car */}
    <path d="M6 48 C 4 48 2 46 2 44 L 4 36 L 12 30 H 26 L 34 36 L 36 44 C 36 46 34 48 32 48 Z" />
    <circle cx="10" cy="48" r="4" />
    <circle cx="28" cy="48" r="4" />
    {/* Car Windows */}
    <path d="M12 30 V36 H26 V30" />
    <line x1="19" y1="30" x2="19" y2="36" />
    <line x1="6" y1="42" x2="32" y2="42" /> {/* Side trim */}
  </svg>
);
