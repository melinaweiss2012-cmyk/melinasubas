import axios from 'axios';
import * as cheerio from 'cheerio';
import axiosRetry from 'axios-retry';
import { VehiculoData, InmuebleData, SubastaEstandarizada } from './types';

/**
 * Función genérica para extraer datos de vehículos desde el texto del edicto.
 * Implementa la regla de "Cero Hallucination": si no encuentra el dato, retorna null.
 */
export function extractVehicleData(text: string): VehiculoData {
  const findLastMatch = (regex: RegExp): string | null => {
    const matches = [...text.matchAll(regex)];
    return matches.length > 0 ? matches[matches.length - 1][1].trim() : null;
  };

  // 1. Extracción Dinámica (Cero Hardcodeo) - Buscando la última ocurrencia
  const dominio = findLastMatch(/(?:Dominio|Patente|Chapa)[\\s:.-]*([A-Z0-9]{6,7})\\b/gi);
  const marca = findLastMatch(/(?:Marca)[\\s:.-]*([A-Za-z0-9\\s]+?)(?=\\s*(?:Modelo|Tipo|Año|Motor|Chasis|Dominio|Patente|KM|Kilometraje|Kms|,|\\.|$))/gi);
  const modelo = findLastMatch(/(?:Modelo)[\\s:.-]*([A-Za-z0-9\\s]+?)(?=\\s*(?:Marca|Tipo|Año|Motor|Chasis|Dominio|Patente|KM|Kilometraje|Kms|,|\\.|$))/gi);
  const tipo = findLastMatch(/(?:Tipo)[\\s:.-]*([A-Za-z0-9\\s]+?)(?=\\s*(?:Marca|Modelo|Año|Motor|Chasis|Dominio|Patente|KM|Kilometraje|Kms|,|\\.|$))/gi);

  const anioMatch = findLastMatch(/(?:Año|Modelo)[\\s:.-]*(\\d{4})\\b/gi);
  const anio = anioMatch ? parseInt(anioMatch, 10) : null;

  const motor = findLastMatch(/(?:Motor)(?:[\\s\\w]*?)(?:N[°º]|Nro|N[úu]mero)?[\\s:.-]*([A-Za-z0-9]+)\\b/gi);
  const chasis = findLastMatch(/(?:Chasis)(?:[\\s\\w]*?)(?:N[°º]|Nro|N[úu]mero)?[\\s:.-]*([A-Za-z0-9]+)\\b/gi);

  const kilometrajeMatch = findLastMatch(/(?:KM|Kilometraje|Kms)[\\s:.-]*([\\d.,]+)\\b/gi);
  const kilometraje = kilometrajeMatch ? parseInt(kilometrajeMatch.replace(/[.,]/g, ''), 10) : null;

  const color = findLastMatch(/(?:Color)[\\s:.-]*([A-Za-z\\s]+?)(?=\\s*(?:Marca|Modelo|Año|Motor|Chasis|Dominio|Patente|KM|Kilometraje|Kms|,|\\.|$))/gi);
  const combustible = findLastMatch(/(?:Combustible)[\\s:.-]*([A-Za-z\\s]+?)(?=\\s*(?:Marca|Modelo|Año|Motor|Chasis|Dominio|Patente|KM|Kilometraje|Kms|,|\\.|$))/gi);
  const transmision = findLastMatch(/(?:Transmisión|Transmision)[\\s:.-]*([A-Za-z\\s]+?)(?=\\s*(?:Marca|Modelo|Año|Motor|Chasis|Dominio|Patente|KM|Kilometraje|Kms|,|\\.|$))/gi);
  const observaciones_danos = findLastMatch(/(?:Estado|Daños|Observaciones)[\\s:.-]*([^.,\\n]+)/gi);

  // 2. Regla estricta para Estado Legal / Deudas
  let deudas_informadas = "Consultar deudas en el portal oficial";

  const deudaRegex = /((?:Deuda|Multa|Patente adeudada)[^.]*?\\$\\s*[\\d.,]+[^.]*)/i;
  const deudaMatch = text.match(deudaRegex);
  if (deudaMatch) {
    deudas_informadas = deudaMatch[1].trim();
  }

  // 3. Mapeo al Objeto
  return {
    datos_registrales: {
      dominio: dominio || null,
      marca: marca || null,
      modelo: modelo || null,
      anio: anio,
      motor: motor || null,
      chasis: chasis || null,
    },
    estado_fisico: {
      kilometraje: kilometraje,
      color: color || null,
      tiene_llave: null,
      condicion_general: null,
      observaciones_danos: observaciones_danos || null,
    },
    ficha_tecnica: {
      combustible: combustible || null,
      transmision: transmision || null,
      tipo_vehiculo: tipo || null,
    },
    estado_legal: {
      deudas_informadas: deudas_informadas,
      radicacion: null,
    }
  };
}

/**
 * Extrae datos de inmuebles desde el texto del edicto.
 */
export function extractInmuebleData(text: string): InmuebleData {
  const findMatch = (regex: RegExp): string | null => {
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  };

  const superficieMatch = findMatch(/((?:Superficie|Area|Área)[\\s:.-]*[\\d.,]+\\s*(?:m2|metros cuadrados|hectáreas|has|mts2|m²|ha))/i);
  const superficie = superficieMatch || findMatch(/([\\d.,]+\\s*(?:m2|metros cuadrados|hectáreas|has|mts2|m²|ha))/i);

  const matricula_catastral = findMatch(/(?:Matrícula|Partida|Plano|Folio|Nomenclatura)[\\s:.-]*([A-Za-z0-9/-]+)/i);

  const estadoMatch = text.match(/(ocupado|desocupado|habitado|inquilino|intruso|vivienda)/i);
  const estado_ocupacion = estadoMatch ? estadoMatch[1].toUpperCase() : null;

  const ubicacion_fisica = findMatch(/(?:sito en|ubicado en|calle|domicilio)[\\s:.-]*([^.,\\n]+)/i);

  // Regla de deudas para inmuebles
  let deudas_informadas = "Consultar deudas en el portal oficial";
  const deudaRegex = /((?:Deuda|Multa|Impuestos|Tasas)[^.]*?\\$\\s*[\\d.,]+[^.]*)/i;
  const deudaMatch = text.match(deudaRegex);
  if (deudaMatch) {
    deudas_informadas = deudaMatch[1].trim();
  }

  return {
    superficie: superficie || null,
    matricula_catastral: matricula_catastral || null,
    estado_ocupacion: estado_ocupacion || null,
    ubicacion_fisica: ubicacion_fisica || null,
    deudas_informadas
  };
}

// @ts-ignore
const axiosRetryInstance = axiosRetry.default || axiosRetry;
axiosRetryInstance(axios, {
  retries: 3,
  retryDelay: (retryCount: number) => {
    return retryCount * 2000;
  },
  retryCondition: (error: any) => {
    return axiosRetryInstance.isNetworkOrIdempotentRequestError(error) || error.response?.status === 429;
  },
});

const BASE_URL = "https://subastas.jusentrerios.gob.ar";

async function extractAllIds(): Promise<number[]> {
  const allIds: number[] = [];
  let offset = 0;
  const limit = 50;

  while (true) {
    try {
      const url = `${BASE_URL}/api/good_search/?limit=${limit}&offset=${offset}`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json'
        }
      });

      const results = response.data.results;
      if (!results || results.length === 0) break;

      for (const item of results) {
        if (item.id) allIds.push(item.id);
      }

      if (!response.data.next || results.length < limit) break;
      offset += limit;
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      break;
    }
  }
  return allIds;
}

async function extractDetails(id: number): Promise<SubastaEstandarizada | null> {
  const url = `${BASE_URL}/api/public_good/${id}/`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });

    const data = response.data;
    let descripcionLimpia = (data.name || "") + "\n\n" + (data.description || "");

    if (descripcionLimpia) {
      descripcionLimpia = descripcionLimpia
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<\/div>/gi, '\n')
        .replace(/<\/li>/gi, '\n');

      const $ = cheerio.load(descripcionLimpia);
      descripcionLimpia = $('body').text().trim()
        .replace(/[ \t]+/g, ' ')
        .replace(/\n\s*\n/g, '\n\n');
    }

    let tipoBien = "OTROS";
    const title = (data.name || "").toLowerCase();
    const description = (data.description || "").toLowerCase();

    const titleVehiculoRegex = /\b(auto|autos|automovil|automoviles|automóvil|automóviles|automotor|automotores|vehiculo|vehiculos|vehículo|vehículos|camioneta|camionetas|pick-up|pick up|moto|motos|motocicleta|motocicletas|furgon|furgones|furgón|utilitario|utilitarios|acoplado|acoplados|semirremolque|semirremolques|tractor|tractores|rodado|rodados|renault|ford|chevrolet|volkswagen|vw|fiat|peugeot|toyota|honda|yamaha|suzuki|kawasaki|bmw|mercedes|audi|nissan|citroen|citroën|kangoo|gol|corsa|clio|hilux|ranger|amarok)\b/i;
    const titleInmuebleRegex = /\b(inmueble|inmuebles|casa|casas|lote|lotes|terreno|terrenos|departamento|departamentos|depto|deptos|ph|cochera|cocheras|campo|campos|fraccion|fracciones|fracción|quinta|quintas|local|locales|vivienda|viviendas|edificio|edificios|galpon|galpones|galpón|deposito|depositos|depósito|depósitos|nave industrial|naves industriales|unidad funcional|unidades funcionales|parcela|parcelas|finca|fincas)\b/i;

    if (titleVehiculoRegex.test(title) && !titleInmuebleRegex.test(title)) {
      tipoBien = "VEHICULO";
    } else if (titleInmuebleRegex.test(title) && !titleVehiculoRegex.test(title)) {
      tipoBien = "INMUEBLE";
    } else {
      let scoreVehiculo = 0;
      let scoreInmueble = 0;
      const textToSearch = title + " " + description;

      const vehiculoKeywords = [
        { word: 'dominio', weight: 3 }, { word: 'patente', weight: 3 }, { word: 'chasis', weight: 2 },
        { word: 'motor', weight: 2 }, { word: 'automotor', weight: 3 }, { word: 'modelo', weight: 1 },
        { word: 'marca', weight: 1 }, { word: 'sedan', weight: 2 }, { word: 'hatchback', weight: 2 },
        { word: 'km', weight: 1 }, { word: 'kilometros', weight: 1 }, { word: 'rodado', weight: 2 }
      ];

      const inmuebleKeywords = [
        { word: 'partida inmobiliaria', weight: 3 }, { word: 'mensura', weight: 3 }, { word: 'superficie', weight: 2 },
        { word: 'metros cuadrados', weight: 2 }, { word: 'm2', weight: 2 }, { word: 'hectareas', weight: 2 },
        { word: 'manzana', weight: 2 }, { word: 'parcela', weight: 2 }, { word: 'folio', weight: 2 },
        { word: 'tomo', weight: 2 }, { word: 'finca', weight: 3 }, { word: 'edificado', weight: 2 },
        { word: 'construido', weight: 2 }, { word: 'plano', weight: 1 }, { word: 'matricula', weight: 1 }
      ];

      vehiculoKeywords.forEach(k => {
        const matches = textToSearch.match(new RegExp(`\\b${k.word}\\b`, 'gi'));
        if (matches) scoreVehiculo += matches.length * k.weight;
      });

      inmuebleKeywords.forEach(k => {
        const matches = textToSearch.match(new RegExp(`\\b${k.word}\\b`, 'gi'));
        if (matches) scoreInmueble += matches.length * k.weight;
      });

      if (titleVehiculoRegex.test(title)) scoreVehiculo += 5;
      if (titleInmuebleRegex.test(title)) scoreInmueble += 5;

      if (scoreVehiculo > scoreInmueble && scoreVehiculo >= 3) {
        tipoBien = "VEHICULO";
      } else if (scoreInmueble > scoreVehiculo && scoreInmueble >= 3) {
        tipoBien = "INMUEBLE";
      }
    }

    const imagenes = (data.photos || []).map((p: any) => p.url).filter(Boolean);
    if (imagenes.length === 0 && data.mini_photo) imagenes.push(data.mini_photo);

    const precioActual = parseFloat(data.price || "0");
    const proximaOferta = parseFloat(data.next_offer || "0");
    let incrementoMinimo = proximaOferta - precioActual;
    if (incrementoMinimo < 0) incrementoMinimo = 0;

    const deudasImpuestos = data.taxes && data.taxes.length > 0 
      ? data.taxes.map((t: any) => `${t.nombre}: ${t.monto}`).join(' | ')
      : "No especificado";

    return {
      id_interno: `er-${data.id}`,
      metadatos_origen: {
        provincia: "Entre Ríos",
        fuente: "Justicia Entre Ríos - Portal Electrónico",
        url_origen: `${BASE_URL}${data.uri || `/product/er/${data.id}/`}`,
        tipo_extraccion: "API",
        numero_boletin: null
      },
      datos_expediente: {
        caratula: data.decree?.title || data.name || "No especificada",
        nro_expediente: data.decree?.proceeding || "No especificado",
        juzgado: data.decree?.vendor?.name || "No especificado",
        acreedor: "No especificado",
        deudor: "No especificado"
      },
      fechas_y_lugar: {
        modalidad: "ELECTRONICA",
        estado: data.status || "EN_CURSO",
        fecha_inicio: data.start_date || null,
        fecha_fin: data.end_date || null,
        fecha_subasta_presencial: null,
        lugar_remate: "Portal Web"
      },
      financiero: {
        moneda: data.currency?.code || "ARS",
        precio_base: parseFloat(data.base_price || data.price || "0"),
        oferta_actual: precioActual, 
        garantia_participacion: parseFloat(data.warranty || "0"), 
        incremento_minimo: incrementoMinimo, 
        deudas_impuestos: deudasImpuestos
      },
      bien_subastado: {
        tipo: tipoBien,
        titulo: data.name || "Sin título",
        descripcion_completa: descripcionLimpia,
        vehiculo: tipoBien === "VEHICULO" ? extractVehicleData(descripcionLimpia) : null,
        inmueble: tipoBien === "INMUEBLE" ? extractInmuebleData(descripcionLimpia) : null,
        imagenes: imagenes,
        videos: data.video ? [data.video] : (data.videos || [])
      },
      martillero: {
        nombre: data.auctioneer?.name || "Martillero Oficial",
        matricula: data.auctioneer?.doc || "No especificada",
        telefono: data.auctioneer?.phone || "No especificado"
      },
      decreto_url: data.decree?.file || null
    };
  } catch (error) {
    return null;
  }
}

export async function scrapeEntreRios(): Promise<SubastaEstandarizada[]> {
  try {
    const ids = await extractAllIds();
    const subastasDetalladas: SubastaEstandarizada[] = [];
    const chunkSize = 3;
    for (let i = 0; i < ids.length; i += chunkSize) {
      const chunk = ids.slice(i, i + chunkSize);
      const promises = chunk.map(id => extractDetails(id));
      const results = await Promise.all(promises);
      for (const res of results) {
        if (res) subastasDetalladas.push(res);
      }
      if (i + chunkSize < ids.length) await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return subastasDetalladas;
  } catch (error) {
    throw error;
  }
}
