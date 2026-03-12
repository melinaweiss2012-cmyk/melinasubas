export interface VehiculoData {
  datos_registrales: {
    dominio: string | null;
    marca: string | null;
    modelo: string | null;
    anio: number | null;
    motor: string | null;
    chasis: string | null;
  };
  estado_fisico: {
    kilometraje: number | null;
    color: string | null;
    tiene_llave: boolean | null;
    condicion_general: string | null;
    observaciones_danos: string | null;
  };
  ficha_tecnica: {
    combustible: string | null;
    transmision: string | null;
    tipo_vehiculo: string | null;
  };
  estado_legal: {
    deudas_informadas: string;
    radicacion: string | null;
  };
}

export interface InmuebleData {
  superficie: string | null;
  matricula_catastral: string | null;
  estado_ocupacion: string | null;
  ubicacion_fisica: string | null;
  deudas_informadas?: string | null;
}

export interface SubastaEstandarizada {
  id_interno: string;
  metadatos_origen: {
    provincia: string;
    fuente: string;
    url_origen: string;
    tipo_extraccion: string;
    numero_boletin: string | null;
  };
  datos_expediente: {
    caratula: string;
    nro_expediente: string;
    juzgado: string;
    acreedor: string;
    deudor: string;
  };
  fechas_y_lugar: {
    modalidad: string;
    estado: string;
    fecha_inicio: string | null;
    fecha_fin: string | null;
    fecha_subasta_presencial: string | null;
    lugar_remate: string;
  };
  financiero: {
    moneda: string;
    precio_base: number;
    oferta_actual: number;
    garantia_participacion: number;
    incremento_minimo: number;
    deudas_impuestos: string;
  };
  bien_subastado: {
    tipo: string;
    titulo: string;
    descripcion_completa: string;
    vehiculo: VehiculoData | null;
    inmueble: InmuebleData | null;
    imagenes: string[];
    videos: string[];
  };
  martillero: {
    nombre: string;
    matricula: string;
    telefono: string;
  };
  decreto_url: string | null;
}
