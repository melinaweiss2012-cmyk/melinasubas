import React from 'react';
import { X, MapPin, Clock, Info, User, Phone, FileText, ExternalLink, Car, Home as HomeIcon, Package } from 'lucide-react';
import { SubastaEstandarizada } from '../types';

interface AuctionDetailProps {
  auction: SubastaEstandarizada;
  onClose: () => void;
}

export const AuctionDetail: React.FC<AuctionDetailProps> = ({ auction, onClose }) => {
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: auction.financiero.moneda,
    maximumFractionDigits: 0,
  }).format(auction.financiero.precio_base);

  const formattedOffer = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: auction.financiero.moneda,
    maximumFractionDigits: 0,
  }).format(auction.financiero.oferta_actual);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
        {/* Header */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onClose}
            className="p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
          >
            <X className="w-6 h-6 text-slate-900" />
          </button>
        </div>

        <div className="overflow-y-auto flex-grow">
          {/* Hero / Images */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="h-[400px] bg-slate-100 relative">
              <img 
                src={auction.bien_subastado.imagenes[0] || 'https://picsum.photos/seed/auction/800/600'} 
                alt={auction.bien_subastado.titulo}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 left-4 flex gap-2">
                {auction.bien_subastado.imagenes.slice(1, 4).map((img, i) => (
                  <img 
                    key={i}
                    src={img}
                    className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-md"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
            </div>

            <div className="p-8 flex flex-col justify-center bg-slate-50">
              <div className="flex items-center gap-2 text-[#5A7668] font-semibold mb-4">
                {auction.bien_subastado.tipo === 'VEHICULO' ? <Car className="w-5 h-5" /> : 
                 auction.bien_subastado.tipo === 'INMUEBLE' ? <HomeIcon className="w-5 h-5" /> : 
                 <Package className="w-5 h-5" />}
                <span className="uppercase tracking-wider text-sm">{auction.bien_subastado.tipo}</span>
              </div>
              
              <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
                {auction.bien_subastado.titulo}
              </h1>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">{auction.metadatos_origen.provincia}</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">Estado: {auction.fechas_y_lugar.estado}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Precio Base</p>
                  <p className="text-2xl font-bold text-slate-900">{formattedPrice}</p>
                </div>
                <div className="bg-[#C27A2F]/10 p-4 rounded-xl border border-[#C27A2F]/20 shadow-sm">
                  <p className="text-xs text-[#C27A2F] uppercase font-bold mb-1">Oferta Actual</p>
                  <p className="text-2xl font-bold text-[#C27A2F]">{formattedOffer}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-10">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-[#5A7668]" />
                  <h2 className="text-xl font-bold text-slate-900">Descripción</h2>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {auction.bien_subastado.descripcion_completa}
                </div>
              </section>

              {auction.bien_subastado.tipo === 'VEHICULO' && auction.bien_subastado.vehiculo && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Car className="w-5 h-5 text-[#5A7668]" />
                    <h2 className="text-xl font-bold text-slate-900">Especificaciones del Vehículo</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(auction.bien_subastado.vehiculo.datos_registrales).map(([key, val]) => (
                      <div key={key} className="flex justify-between p-3 bg-white border-b border-slate-100">
                        <span className="text-slate-500 capitalize">{key.replace('_', ' ')}</span>
                        <span className="font-semibold text-slate-900">{val || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {auction.bien_subastado.tipo === 'INMUEBLE' && auction.bien_subastado.inmueble && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <HomeIcon className="w-5 h-5 text-[#5A7668]" />
                    <h2 className="text-xl font-bold text-slate-900">Detalles del Inmueble</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(auction.bien_subastado.inmueble).map(([key, val]) => (
                      <div key={key} className="flex justify-between p-3 bg-white border-b border-slate-100">
                        <span className="text-slate-500 capitalize">{key.replace('_', ' ')}</span>
                        <span className="font-semibold text-slate-900">{val || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column: Sidebar Info */}
            <div className="space-y-8">
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="w-5 h-5 text-[#B5CCBE]" />
                  <h3 className="text-lg font-bold">Información Judicial</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-slate-400 mb-1">Expediente</p>
                    <p className="font-medium">{auction.datos_expediente.nro_expediente}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">Juzgado</p>
                    <p className="font-medium">{auction.datos_expediente.juzgado}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">Carátula</p>
                    <p className="font-medium line-clamp-3">{auction.datos_expediente.caratula}</p>
                  </div>
                </div>
                {auction.decreto_url && (
                  <a 
                    href={auction.decreto_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-8 flex items-center justify-center gap-2 w-full py-3 bg-[#B5CCBE] text-slate-900 rounded-xl font-bold hover:bg-white transition-colors"
                  >
                    Ver Edicto / Decreto <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <User className="w-5 h-5 text-[#5A7668]" />
                  <h3 className="text-lg font-bold text-slate-900">Martillero</h3>
                </div>
                <div className="space-y-4">
                  <p className="font-bold text-slate-900">{auction.martillero.nombre}</p>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-4 h-4" />
                    <span>{auction.martillero.telefono}</span>
                  </div>
                  <p className="text-xs text-slate-400">Matrícula: {auction.martillero.matricula}</p>
                </div>
              </div>

              <a 
                href={auction.metadatos_origen.url_origen}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 bg-[#5A7668] text-white rounded-2xl font-bold hover:bg-[#3d5248] transition-colors shadow-lg shadow-[#5A7668]/20"
              >
                Ir al Portal Oficial <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
