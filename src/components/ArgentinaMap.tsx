import React from 'react';

interface Province {
  id: string;
  name: string;
  path: string;
  count: number;
  centerX?: number;
  centerY?: number;
}

interface ArgentinaMapProps {
  onProvinceClick: (province: string) => void;
  selectedProvince?: string;
  provinces: Province[];
}

export const ArgentinaMap: React.FC<ArgentinaMapProps> = ({ onProvinceClick, selectedProvince, provinces }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <svg
        viewBox="0 0 400 1050"
        className="w-full h-full max-h-[750px] drop-shadow-2xl"
        style={{ filter: 'drop-shadow(0 25px 40px rgba(0,0,0,0.25))' }}
      >
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="2" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        <g filter="url(#shadow)">
          {provinces.map((prov) => (
            <path
              key={prov.id}
              d={prov.path}
              fill={selectedProvince === prov.name ? '#C27A2F' : '#F3EFE6'}
              stroke={selectedProvince === prov.name ? '#fff' : '#5A7668'}
              strokeWidth={selectedProvince === prov.name ? '2' : '1'}
              className="transition-all duration-300 cursor-pointer hover:fill-[#B5CCBE] hover:stroke-white"
              onClick={() => onProvinceClick(prov.name)}
            >
              <title>{prov.name} ({prov.count} subastas)</title>
            </path>
          ))}

          {/* Islas Malvinas (Visual only as requested) */}
          <g className="opacity-80">
            <path
              d="M310 910 q5 -2 10 0 q2 5 -2 8 q-5 2 -8 -2 Z M335 915 q3 -3 8 -1 q2 4 -1 7 q-4 3 -7 -1 Z"
              fill="#F3EFE6"
              stroke="#5A7668"
              strokeWidth="1"
            />
            <text x="310" y="935" className="text-[10px] fill-slate-500 font-bold pointer-events-none">Islas Malvinas</text>
          </g>

          {/* CABA Accessibility Callout */}
          <g 
            className="cursor-pointer group" 
            onClick={() => onProvinceClick('CABA')}
          >
            {/* Invisible larger hit area */}
            <circle cx="290" cy="530" r="15" fill="transparent" />
            {/* Visible indicator */}
            <circle 
              cx="290" 
              cy="530" 
              r="4" 
              fill={selectedProvince === 'CABA' ? '#C27A2F' : '#5A7668'} 
              className="transition-colors duration-300 group-hover:fill-[#C27A2F]"
            />
            <line x1="290" y1="530" x2="330" y2="530" stroke="#5A7668" strokeWidth="1" strokeDasharray="2,2" />
            <text 
              x="335" 
              y="534" 
              className={`text-[12px] font-bold transition-colors duration-300 ${selectedProvince === 'CABA' ? 'fill-[#C27A2F]' : 'fill-slate-600 group-hover:fill-[#C27A2F]'}`}
            >
              CABA
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

// More realistic organic paths (Approximation with more vertices for "professional" look)
export const argentinaProvincesData: Province[] = [
  { id: 'ba', name: 'Buenos Aires', count: 745, path: 'M230 500 L260 490 L285 520 L310 525 L325 580 L310 630 L280 660 L240 650 L210 620 L200 550 Z' },
  { id: 'caba', name: 'CABA', count: 897, path: 'M288 528 L292 528 L292 532 L288 532 Z' },
  { id: 'cba', name: 'Córdoba', count: 431, path: 'M175 390 L235 395 L245 485 L185 495 L170 450 Z' },
  { id: 'sf', name: 'Santa Fe', count: 340, path: 'M235 340 L275 350 L285 515 L260 490 L235 485 Z' },
  { id: 'mz', name: 'Mendoza', count: 188, path: 'M115 440 L170 450 L185 555 L125 565 L110 500 Z' },
  { id: 'er', name: 'Entre Ríos', count: 141, path: 'M275 410 L315 420 L305 515 L285 515 Z' },
  { id: 'sa', name: 'Salta', count: 143, path: 'M140 140 L225 150 L215 225 L180 225 L175 200 L145 200 Z' },
  { id: 'tu', name: 'Tucumán', count: 90, path: 'M175 225 L205 225 L205 275 L175 275 Z' },
  { id: 'nq', name: 'Neuquén', count: 79, path: 'M90 570 L155 585 L145 685 L85 675 L100 620 Z' },
  { id: 'rn', name: 'Río Negro', count: 44, path: 'M145 595 L255 615 L235 725 L135 705 L155 650 Z' },
  { id: 'sj', name: 'San Juan', count: 30, path: 'M125 370 L175 380 L185 445 L135 435 L120 400 Z' },
  { id: 'ch', name: 'Chaco', count: 22, path: 'M215 220 L285 235 L275 315 L205 305 Z' },
  { id: 'ct', name: 'Corrientes', count: 18, path: 'M285 315 L345 325 L335 415 L275 410 Z' },
  { id: 'mi', name: 'Misiones', count: 10, path: 'M345 275 L385 285 L375 345 L345 325 Z' },
  { id: 'cb', name: 'Chubut', count: 5, path: 'M125 715 L235 735 L215 845 L115 825 L135 770 Z' },
  { id: 'lp', name: 'La Pampa', count: 4, path: 'M165 495 L235 505 L225 600 L155 585 Z' },
  { id: 'ju', name: 'Jujuy', count: 15, path: 'M155 90 L205 100 L195 155 L145 145 Z' },
  { id: 'fo', name: 'Formosa', count: 12, path: 'M225 170 L305 185 L295 235 L215 225 Z' },
  { id: 'se', name: 'Santiago del Estero', count: 25, path: 'M185 275 L245 285 L235 375 L175 365 Z' },
  { id: 'lr', name: 'La Rioja', count: 8, path: 'M135 305 L185 315 L195 395 L145 385 Z' },
  { id: 'ca', name: 'Catamarca', count: 11, path: 'M135 235 L185 245 L175 315 L125 305 Z' },
  { id: 'sl', name: 'San Luis', count: 14, path: 'M155 455 L195 465 L185 535 L145 525 Z' },
  { id: 'sc', name: 'Santa Cruz', count: 3, path: 'M105 845 L215 865 L195 975 L95 955 L115 900 Z' },
  { id: 'tf', name: 'Tierra del Fuego', count: 2, path: 'M145 975 L205 985 L195 1025 L135 1015 Z' },
];
