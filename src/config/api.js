/**
 * Configuração da API do TVMaze
 * Este arquivo centraliza todas as configurações relacionadas à API externa
 */

// URL base da API do TVMaze
// ✅ SEM API KEY NECESSÁRIA - Totalmente gratuito e sem limites!
export const BASE_URL = 'https://api.tvmaze.com';

/**
 * Função helper para obter URL da imagem
 * TVMaze já retorna URLs completas nas propriedades 'image.medium' e 'image.original'
 * @param {Object} imageObj - Objeto de imagem do TVMaze
 * @param {string} size - 'medium' ou 'original' (padrão: 'medium')
 * @returns {string|null} URL da imagem ou null se não existir
 */
export const getImageUrl = (imageObj, size = 'medium') => {
  if (!imageObj) return null;
  return imageObj[size] || imageObj.original || null;
};

/**
 * Lista de gêneros de séries/shows do TVMaze
 * TVMaze retorna gêneros como array de strings, não IDs
 * Esta lista é para referência e filtros
 */
export const GENRES = [
  'Drama',
  'Comedy',
  'Action',
  'Adventure',
  'Thriller',
  'Horror',
  'Science-Fiction',
  'Fantasy',
  'Mystery',
  'Crime',
  'Romance',
  'Family',
  'Anime',
  'Music',
  'War',
  'Western',
  'History',
  'Supernatural'
];

/**
 * Tradução de gêneros (Inglês → Português)
 */
export const GENRE_TRANSLATION = {
  'Drama': 'Drama',
  'Comedy': 'Comédia',
  'Action': 'Ação',
  'Adventure': 'Aventura',
  'Thriller': 'Thriller',
  'Horror': 'Terror',
  'Science-Fiction': 'Ficção Científica',
  'Fantasy': 'Fantasia',
  'Mystery': 'Mistério',
  'Crime': 'Crime',
  'Romance': 'Romance',
  'Family': 'Família',
  'Anime': 'Anime',
  'Music': 'Música',
  'War': 'Guerra',
  'Western': 'Faroeste',
  'History': 'História',
  'Supernatural': 'Sobrenatural'
};

/**
 * Traduzir gênero para português
 * @param {string} genre - Nome do gênero em inglês
 * @returns {string} Nome do gênero em português
 */
export const translateGenre = (genre) => {
  return GENRE_TRANSLATION[genre] || genre;
};

/**
 * Décadas disponíveis para filtro
 * TVMaze API não tem filtro nativo por década, mas podemos filtrar por ano de estreia
 */
export const DECADES = [
  { label: '2020s', startYear: 2020, endYear: 2029 },
  { label: '2010s', startYear: 2010, endYear: 2019 },
  { label: '2000s', startYear: 2000, endYear: 2009 },
  { label: '1990s', startYear: 1990, endYear: 1999 },
  { label: '1980s', startYear: 1980, endYear: 1989 },
  { label: '1970s', startYear: 1970, endYear: 1979 },
  { label: 'Clássicos', startYear: 1900, endYear: 1969 }
];
