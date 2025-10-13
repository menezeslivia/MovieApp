/**
 * Serviço de comunicação com a API do TVMaze
 * Centraliza todas as chamadas HTTP para a API de shows/séries
 * ✅ SEM API KEY - Totalmente gratuito e sem limites!
 */

import axios from 'axios';
import { BASE_URL } from '../config/api';

/**
 * Instância configurada do Axios para requisições à API
 * TVMaze não requer API key ou autenticação
 */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 segundos de timeout
});

/**
 * Busca shows/séries populares (ordenados por rating)
 * @param {number} page - Número da página (padrão: 1)
 * @returns {Promise} Promise com os dados dos shows populares
 */
export const getPopularMovies = async (page = 1) => {
  try {
    // TVMaze não tem endpoint direto de "populares", então usamos /shows e ordenamos
    // Buscar múltiplas páginas de shows e ordená-los por rating
    const response = await api.get('/shows', {
      params: {
        page: page - 1, // TVMaze usa page 0-indexed
      },
    });
    
    // Ordenar por rating (descendente)
    const sortedShows = response.data
      .filter(show => show.rating && show.rating.average)
      .sort((a, b) => (b.rating.average || 0) - (a.rating.average || 0));
    
    // Formatar resposta similar ao TMDB
    return {
      page,
      results: sortedShows,
      total_pages: 100, // TVMaze tem muitas páginas
      total_results: sortedShows.length,
    };
  } catch (error) {
    console.error('Erro ao buscar shows populares:', error);
    throw error;
  }
};

/**
 * Busca detalhes de um show/série específico
 * @param {number} showId - ID do show
 * @returns {Promise} Promise com os detalhes do show
 */
export const getMovieDetails = async (showId) => {
  try {
    // Buscar informações do show
    const showResponse = await api.get(`/shows/${showId}`);
    
    // Buscar elenco do show
    const castResponse = await api.get(`/shows/${showId}/cast`);
    
    // Combinar dados (formato similar ao TMDB para compatibilidade)
    return {
      ...showResponse.data,
      credits: {
        cast: castResponse.data.map(item => ({
          name: item.person.name,
          character: item.character.name,
          profile_path: item.person.image?.medium || null,
          id: item.person.id,
        })),
      },
    };
  } catch (error) {
    console.error('Erro ao buscar detalhes do show:', error);
    throw error;
  }
};

/**
 * Busca shows/séries por termo de pesquisa
 * @param {string} query - Termo de busca
 * @param {number} page - Número da página (não utilizado pelo TVMaze search)
 * @returns {Promise} Promise com os resultados da busca
 */
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await api.get('/search/shows', {
      params: { q: query },
    });
    
    // TVMaze retorna array de objetos com { score, show }
    // Transformar para formato compatível
    return {
      page,
      results: response.data.map(item => item.show),
      total_pages: 1,
      total_results: response.data.length,
    };
  } catch (error) {
    console.error('Erro ao buscar shows:', error);
    throw error;
  }
};

/**
 * Descobre shows com filtros específicos
 * @param {Object} filters - Objeto com filtros (gênero, etc)
 * @returns {Promise} Promise com os shows filtrados
 */
export const discoverMovies = async (filters = {}) => {
  try {
    // TVMaze não tem endpoint discover, então buscamos todos shows e filtramos
    const response = await api.get('/shows');
    
    let shows = response.data;
    
    // Aplicar filtros se necessário
    if (filters.genre) {
      shows = shows.filter(show => 
        show.genres && show.genres.includes(filters.genre)
      );
    }
    
    // Ordenar por rating
    shows.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
    
    return {
      page: 1,
      results: shows.slice(0, 20), // Limitar a 20 resultados
      total_pages: 1,
      total_results: shows.length,
    };
  } catch (error) {
    console.error('Erro ao descobrir shows:', error);
    throw error;
  }
};

/**
 * Busca shows por gênero
 * @param {string} genre - Nome do gênero
 * @param {number} page - Número da página
 * @returns {Promise} Promise com os shows do gênero
 */
export const getMoviesByGenre = async (genre, page = 1) => {
  try {
    const response = await api.get('/shows');
    
    // Filtrar por gênero
    const filteredShows = response.data.filter(show =>
      show.genres && show.genres.includes(genre)
    );
    
    // Ordenar por rating
    filteredShows.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
    
    return {
      page,
      results: filteredShows,
      total_pages: 1,
      total_results: filteredShows.length,
    };
  } catch (error) {
    console.error('Erro ao buscar shows por gênero:', error);
    throw error;
  }
};

/**
 * Busca shows em alta no momento
 * TVMaze não tem endpoint de trending, então retornamos shows mais bem avaliados
 * @param {number} page - Número da página
 * @returns {Promise} Promise com os shows em alta
 */
export const getTrendingMovies = async (page = 1) => {
  try {
    const response = await api.get('/shows', {
      params: {
        page: page - 1,
      },
    });
    
    // Ordenar por rating (simula "trending")
    const trendingShows = response.data
      .filter(show => show.rating && show.rating.average)
      .sort((a, b) => (b.rating.average || 0) - (a.rating.average || 0))
      .slice(0, 20);
    
    return {
      page,
      results: trendingShows,
      total_pages: 50,
      total_results: trendingShows.length,
    };
  } catch (error) {
    console.error('Erro ao buscar shows em alta:', error);
    throw error;
  }
};

/**
 * Busca shows por período (década)
 * @param {number} startYear - Ano inicial
 * @param {number} endYear - Ano final
 * @param {number} page - Número da página
 * @returns {Promise} Promise com os shows do período
 */
export const getMoviesByDecade = async (startYear, endYear, page = 1) => {
  try {
    const response = await api.get('/shows');
    
    // Filtrar por ano de estreia (premiered)
    const filteredShows = response.data.filter(show => {
      if (!show.premiered) return false;
      const year = new Date(show.premiered).getFullYear();
      return year >= startYear && year <= endYear;
    });
    
    // Ordenar por rating
    filteredShows.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
    
    return {
      page,
      results: filteredShows,
      total_pages: 1,
      total_results: filteredShows.length,
    };
  } catch (error) {
    console.error('Erro ao buscar shows por década:', error);
    throw error;
  }
};

/**
 * Busca shows com múltiplos filtros
 * @param {Object} options - Opções de filtro
 * @returns {Promise} Promise com os shows filtrados
 */
export const getFilteredMovies = async (options = {}) => {
  const { genre, decade, page = 1 } = options;
  
  try {
    const response = await api.get('/shows');
    let shows = response.data;

    // Filtrar por gênero se fornecido
    if (genre) {
      shows = shows.filter(show =>
        show.genres && show.genres.includes(genre)
      );
    }

    // Filtrar por década se fornecido
    if (decade) {
      const { startYear, endYear } = decade;
      shows = shows.filter(show => {
        if (!show.premiered) return false;
        const year = new Date(show.premiered).getFullYear();
        return year >= startYear && year <= endYear;
      });
    }

    // Ordenar por rating
    shows.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));

    return {
      page,
      results: shows,
      total_pages: 1,
      total_results: shows.length,
    };
  } catch (error) {
    console.error('Erro ao buscar shows filtrados:', error);
    throw error;
  }
};

export default {
  getPopularMovies,
  getMovieDetails,
  searchMovies,
  discoverMovies,
  getMoviesByGenre,
  getTrendingMovies,
  getMoviesByDecade,
  getFilteredMovies,
};
