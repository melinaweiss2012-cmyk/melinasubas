import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, ChevronRight, ChevronDown, MinusCircle, Filter, LayoutGrid, X } from 'lucide-react';
import { IconHouse, IconFactory, IconLand, IconCar } from './CustomIcons';
import { ArgentinaMap, argentinaProvincesData } from './ArgentinaMap';
import { generateHeroImage } from '../services/imageService';
import { AuctionDetail } from './AuctionDetail';

import { SubastaEstandarizada } from '../types';

// --- Mock Data ---
const mockProvinces = [
  { name: 'Buenos Aires', count: 745 },
  { name: 'CABA', count: 897 },
  { name: 'Córdoba', count: 431 },
  { name: 'Santa Fe', count: 340 },
  { name: 'Mendoza', count: 188 },
  { name: 'Entre Ríos', count: 141 },
  { name: 'Salta', count: 143 },
  { name: 'Tucumán', count: 90 },
  { name: 'Neuquén', count: 79 },
  { name: 'Río Negro', count: 44 },
  { name: 'San Juan', count: 30 },
  { name: 'Chaco', count: 22 },
  { name: 'Corrientes', count: 18 },
  { name: 'Misiones', count: 10 },
  { name: 'Chubut', count: 5 },
  { name: 'La Pampa', count: 4 },
];

// --- Components ---

const CategoryCard: React.FC<{ icon: any; title: string; active?: boolean; onClick?: () => void }> = ({ icon: Icon, title, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-sm border transition-all group cursor-pointer ${
      active 
        ? 'bg-[#5A7668] border-[#5A7668] shadow-md' 
        : 'bg-white border-slate-100 hover:shadow-md hover:border-[#5A7668]'
    }`}
  >
    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
      active ? 'bg-white/20' : 'bg-[#B5CCBE]/20 group-hover:bg-[#B5CCBE]/40'
    }`}>
      <Icon className={`w-10 h-10 transition-colors ${
        active ? 'text-white' : 'text-[#5A7668] group-hover:text-[#3d5248]'
      }`} />
    </div>
    <span className={`text-sm font-medium transition-colors ${
      active ? 'text-white' : 'text-slate-700 group-hover:text-[#5A7668]'
    }`}>{title}</span>
  </button>
);

const AuctionCard: React.FC<{ auction: SubastaEstandarizada; onClick: () => void }> = ({ auction, onClick }) => {
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: auction.financiero.moneda,
    maximumFractionDigits: 0,
  }).format(auction.financiero.precio_base);

  const endDate = auction.fechas_y_lugar.fecha_fin ? new Date(auction.fechas_y_lugar.fecha_fin) : null;
  const now = new Date();
  const diffTime = endDate ? Math.abs(endDate.getTime() - now.getTime()) : 0;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-shadow flex flex-col cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={auction.bien_subastado.imagenes[0] || 'https://picsum.photos/seed/auction/600/400'}
          alt={auction.bien_subastado.titulo}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-semibold text-slate-700 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {auction.metadatos_origen.provincia}
        </div>
        {endDate && (
          <div className="absolute bottom-3 right-3 bg-red-500 text-white px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm">
            <Clock className="w-3 h-3" />
            Cierra en {diffDays} días
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-xs text-slate-500 mb-2 font-mono">{auction.id_interno}</p>
        <h3 className="text-lg font-semibold text-slate-900 mb-4 line-clamp-2 flex-grow">
          {auction.bien_subastado.titulo}
        </h3>
        
        <div className="pt-4 border-t border-slate-100 flex items-end justify-between mt-auto">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Precio Base</p>
            <p className="text-xl font-bold text-[#C27A2F]">{formattedPrice}</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-[#C27A2F]/10 flex items-center justify-center hover:bg-[#C27A2F] hover:text-white transition-colors text-[#C27A2F]">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [auctions, setAuctions] = useState<SubastaEstandarizada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAuction, setSelectedAuction] = useState<SubastaEstandarizada | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      const url = await generateHeroImage();
      setHeroImageUrl(url);
    };
    fetchImage();

    const fetchAuctions = async () => {
      try {
        const response = await fetch('/api/auctions');
        const data = await response.json();
        if (data.success) {
          setAuctions(data.data);
        }
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  const handleProvinceClick = (province: string) => {
    setSelectedProvince(province === selectedProvince ? undefined : province);
    setIsMenuOpen(false);
  };

  const categories = [
    { id: 'VEHICULO', name: 'Vehículos', icon: IconCar },
    { id: 'INMUEBLE', name: 'Inmuebles', icon: IconHouse },
    { id: 'MAQUINARIA', name: 'Maquinaria', icon: IconFactory },
    { id: 'LOTES', name: 'Lotes Varios', icon: IconLand },
    { id: 'OTROS', name: 'Otros', icon: LayoutGrid },
  ];

  const filteredAuctions = auctions.filter(auction => {
    const provinceMatch = !selectedProvince || auction.metadatos_origen.provincia.toLowerCase() === selectedProvince.toLowerCase();
    const categoryMatch = !selectedCategory || auction.bien_subastado.tipo === selectedCategory;
    return provinceMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {selectedAuction && (
        <AuctionDetail 
          auction={selectedAuction} 
          onClose={() => setSelectedAuction(null)} 
        />
      )}
      {/* Hero Section - Mapa Interactivo de Argentina */}
      <section 
        className="relative min-h-screen flex flex-col pt-6 pb-20 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(to top right, #B5CCBE 50%, #5A7668 50%)' }}
      >
        {/* Navbar */}
        <nav className="relative z-50 flex items-center justify-between px-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-sm max-w-7xl mx-auto w-full mb-8">
          <div className="flex items-center gap-2">
            <IconHouse className="w-8 h-8 text-slate-900" />
            <span className="font-bold text-slate-900 text-xl hidden sm:inline">Subastas Judiciales</span>
          </div>
          
          {/* Search Bar in Header */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar por palabra clave..." 
                className="w-full pl-11 pr-4 py-2 bg-white/50 border border-white/30 rounded-full text-sm focus:outline-none focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-slate-900 font-medium">
            <a href="#" className="hover:text-white transition-colors">Inicio</a>
            <a href="#" className="hover:text-white transition-colors">Subastas</a>
            <a href="#" className="hover:text-white transition-colors">Categorías</a>
            <a href="#" className="hover:text-white transition-colors">Vender</a>
            <a href="#" className="hover:text-white transition-colors">Contacto</a>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10 flex-grow">
          
          {/* Left: Interactive Map */}
          <div className="relative flex flex-col items-center justify-center h-full">
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              {heroImageUrl && (
                <img
                  src={heroImageUrl}
                  alt="Render 3D"
                  className="w-full max-w-2xl object-contain"
                />
              )}
            </div>
            <div className="w-full max-w-md relative z-10">
              <ArgentinaMap 
                onProvinceClick={handleProvinceClick} 
                selectedProvince={selectedProvince}
                provinces={argentinaProvincesData}
              />
            </div>
            <div className="mt-4 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-white/50 text-center">
              <p className="text-sm font-semibold text-[#5A7668]">
                {selectedProvince ? `Provincia: ${selectedProvince}` : 'Seleccioná una provincia en el mapa'}
              </p>
            </div>
          </div>

          {/* Right: Text & Selection UI */}
          <div className="flex flex-col items-start lg:pl-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg leading-tight">
              Subastas Judiciales<br/>en Argentina
            </h1>
            <p className="text-xl text-white/90 mb-8 drop-shadow-md">
              Explorá oportunidades reales en todo el país.
            </p>

            {/* Search & Selection Container */}
            <div className="relative w-full max-w-2xl z-50">
              <div className="flex flex-col bg-[#F3EFE6] rounded-3xl p-6 shadow-2xl relative z-20 border border-white/20">
                
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-[#C27A2F]" />
                  <h2 className="text-2xl font-bold text-slate-800">
                    {selectedProvince || 'Elegí una ubicación'}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="relative">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="w-full flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-slate-200 hover:border-[#C27A2F] transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Filter className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-700 font-medium">
                          {selectedCategory || 'Seleccionar Categoría'}
                        </span>
                      </div>
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    </button>

                    {/* Category Dropdown */}
                    {isMenuOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setSelectedCategory(cat.name);
                              setIsMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none"
                          >
                            <cat.icon className="w-5 h-5 text-[#5A7668]" />
                            <span className="text-slate-700 font-medium">{cat.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button className="w-full bg-[#C27A2F] hover:bg-[#A86825] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg transform hover:scale-[1.02] active:scale-[0.98]">
                    <Search className="w-6 h-6" />
                    Buscar Subastas
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Overlay */}
            <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-2xl">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <p className="text-white/60 text-xs uppercase font-bold tracking-wider mb-1">Subastas Activas</p>
                <p className="text-white text-3xl font-bold">2,450+</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <p className="text-white/60 text-xs uppercase font-bold tracking-wider mb-1">Provincias</p>
                <p className="text-white text-3xl font-bold">24</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section (Secondary) */}
      <section className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <CategoryCard 
              key={cat.id}
              icon={cat.icon} 
              title={cat.name} 
              active={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? undefined : cat.id)}
            />
          ))}
        </div>
      </section>

      {/* Closing Soon Section */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              {selectedProvince || selectedCategory ? 'Resultados de Búsqueda' : 'Cierres Próximos'}
            </h2>
            <p className="text-slate-500">
              {selectedProvince || selectedCategory 
                ? `Mostrando subastas para ${selectedProvince || ''} ${selectedCategory ? `en ${selectedCategory}` : ''}`
                : 'Subastas destacadas que finalizan en los próximos días.'}
            </p>
          </div>
          {(selectedProvince || selectedCategory) && (
            <button 
              onClick={() => { setSelectedProvince(undefined); setSelectedCategory(undefined); }}
              className="flex items-center text-red-500 font-medium hover:text-red-700 transition-colors"
            >
              Limpiar filtros <X className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-80 animate-pulse border border-slate-100">
                <div className="h-48 bg-slate-100" />
                <div className="p-5 space-y-4">
                  <div className="h-4 bg-slate-100 rounded w-1/4" />
                  <div className="h-6 bg-slate-100 rounded w-3/4" />
                </div>
              </div>
            ))
          ) : filteredAuctions.length > 0 ? (
            filteredAuctions.map((auction) => (
              <AuctionCard 
                key={auction.id_interno} 
                auction={auction} 
                onClick={() => setSelectedAuction(auction)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">No se encontraron subastas que coincidan con los filtros seleccionados.</p>
            </div>
          )}
        </div>
        
        <button className="md:hidden w-full mt-8 py-4 rounded-xl border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-100 transition-colors flex items-center justify-center">
          Ver todas las subastas
        </button>
      </section>
    </div>
  );
}

