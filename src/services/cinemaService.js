/**
 * Serviço de Cinemas com OpenStreetMap (Nominatim)
 * Totalmente GRATUITO - sem limites de requests!
 */

import axios from 'axios';

// API Nominatim do OpenStreetMap (gratuita, sem limite!)
const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';

/**
 * Busca cinemas próximos à localização do usuário usando OpenStreetMap
 * @param {number} latitude - Latitude do usuário
 * @param {number} longitude - Longitude do usuário
 * @param {number} raioKm - Raio de busca em km (padrão: 5km)
 * @returns {Promise<Array>} Array de cinemas encontrados
 */
export const getNearbyMovieTheaters = async (latitude, longitude, raioKm = 5) => {
  try {
    // Buscar cinemas/cineteques próximos
    const response = await axios.get(NOMINATIM_API, {
      params: {
        q: 'cinema', // Busca por "cinema"
        format: 'json',
        limit: 50,
        viewbox: `${longitude - 0.1},${latitude - 0.1},${longitude + 0.1},${latitude + 0.1}`,
        bounded: 1,
      },
      headers: {
        'User-Agent': 'MovieApp/1.0', // Nominatim requer User-Agent
      },
    });

    if (!response.data || response.data.length === 0) {
      return [];
    }

    // Filtrar e mapear resultados
    const cinemas = response.data
      .filter(lugar => {
        // Filtrar apenas locais que parecem ser cinemas
        const tipo = lugar.type?.toLowerCase() || '';
        const categoria = lugar.class?.toLowerCase() || '';
        const nome = lugar.display_name?.toLowerCase() || '';

        return (
          (tipo === 'cinema' || tipo === 'theatre') ||
          categoria === 'cinema' ||
          categoria === 'entertainment' ||
          nome.includes('cinema') ||
          nome.includes('cinema') ||
          nome.includes('cine') ||
          nome.includes('theatre') ||
          nome.includes('teatro')
        );
      })
      .map(lugar => {
        const dist = calculateDistance(
          latitude,
          longitude,
          parseFloat(lugar.lat),
          parseFloat(lugar.lon)
        );

        return {
          id: lugar.osm_id,
          nome: lugar.name || lugar.display_name,
          endereco: lugar.display_name,
          latitude: parseFloat(lugar.lat),
          longitude: parseFloat(lugar.lon),
          distancia: dist,
          tipo: lugar.type,
          classe: lugar.class,
        };
      })
      .filter(cinema => cinema.distancia <= raioKm) // Filtrar por raio
      .sort((a, b) => a.distancia - b.distancia); // Ordenar por distância

    return cinemas;
  } catch (error) {
    console.error('Erro ao buscar cinemas:', error.message);
    throw error;
  }
};

/**
 * Calcula distância entre dois pontos usando fórmula de Haversine
 * @param {number} lat1 - Latitude do ponto 1
 * @param {number} lon1 - Longitude do ponto 1
 * @param {number} lat2 - Latitude do ponto 2
 * @param {number} lon2 - Longitude do ponto 2
 * @returns {number} Distância em quilômetros
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Uma casa decimal
};

/**
 * Ordena cinemas por distância
 * @param {Array} cinemas - Array de cinemas
 * @param {string} ordem - 'asc' para crescente ou 'desc' para decrescente
 * @returns {Array} Array ordenado
 */
export const sortCinemasByDistance = (cinemas, ordem = 'asc') => {
  return [...cinemas].sort((a, b) => {
    return ordem === 'asc' ? a.distancia - b.distancia : b.distancia - a.distancia;
  });
};

/**
 * Filtra cinemas por nome
 * @param {Array} cinemas - Array de cinemas
 * @param {string} termo - Termo de busca
 * @returns {Array} Array filtrado
 */
export const filterCinemasByName = (cinemas, termo) => {
  const termoLower = termo.toLowerCase();
  return cinemas.filter(cinema => cinema.nome.toLowerCase().includes(termoLower));
};

/**
 * Filtra cinemas por distância máxima
 * @param {Array} cinemas - Array de cinemas
 * @param {number} distanciaMaxKm - Distância máxima em km
 * @returns {Array} Array filtrado
 */
export const filterCinemasByDistance = (cinemas, distanciaMaxKm) => {
  return cinemas.filter(cinema => cinema.distancia <= distanciaMaxKm);
};

/**
 * Busca cinemas em uma cidade específica
 * @param {string} cidade - Nome da cidade
 * @returns {Promise<Array>} Array de cinemas encontrados
 */
export const searchCinemasByCity = async (cidade) => {
  try {
    // Primeiro, obter as coordenadas da cidade
    const locationResponse = await axios.get(NOMINATIM_API, {
      params: {
        q: cidade,
        format: 'json',
        limit: 1,
      },
      headers: {
        'User-Agent': 'MovieApp/1.0',
      },
    });

    if (!locationResponse.data || locationResponse.data.length === 0) {
      throw new Error(`Cidade "${cidade}" não encontrada`);
    }

    const cityData = locationResponse.data[0];
    const cityLat = parseFloat(cityData.lat);
    const cityLon = parseFloat(cityData.lon);

    // Depois, buscar cinemas naquela localização (raio grande para pegar toda a cidade)
    const response = await axios.get(NOMINATIM_API, {
      params: {
        q: 'cinema',
        format: 'json',
        limit: 100,
        viewbox: `${cityLon - 0.5},${cityLat - 0.5},${cityLon + 0.5},${cityLat + 0.5}`,
        bounded: 1,
      },
      headers: {
        'User-Agent': 'MovieApp/1.0',
      },
    });

    if (!response.data || response.data.length === 0) {
      return [];
    }

    // Filtrar e mapear resultados
    const cinemas = response.data
      .filter(lugar => {
        const tipo = lugar.type?.toLowerCase() || '';
        const categoria = lugar.class?.toLowerCase() || '';
        const nome = lugar.display_name?.toLowerCase() || '';

        return (
          (tipo === 'cinema' || tipo === 'theatre') ||
          categoria === 'cinema' ||
          categoria === 'entertainment' ||
          nome.includes('cinema') ||
          nome.includes('cine') ||
          nome.includes('theatre') ||
          nome.includes('teatro')
        );
      })
      .map(lugar => {
        const dist = calculateDistance(
          cityLat,
          cityLon,
          parseFloat(lugar.lat),
          parseFloat(lugar.lon)
        );

        return {
          id: lugar.osm_id,
          nome: lugar.name || lugar.display_name,
          endereco: lugar.display_name,
          latitude: parseFloat(lugar.lat),
          longitude: parseFloat(lugar.lon),
          distancia: dist,
          tipo: lugar.type,
          classe: lugar.class,
          cidade: cidade,
        };
      })
      .sort((a, b) => a.distancia - b.distancia);

    return cinemas;
  } catch (error) {
    console.error('Erro ao buscar cinemas por cidade:', error.message);
    throw error;
  }
};
