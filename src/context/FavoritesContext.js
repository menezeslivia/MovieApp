/**
 * Context API para gerenciamento de favoritos
 * Permite que qualquer componente da aplicação acesse e modifique a lista de favoritos
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Chave para armazenar favoritos no AsyncStorage
const FAVORITES_STORAGE_KEY = '@movieapp:favorites';

// Criação do contexto
export const FavoritesContext = createContext();

/**
 * Hook customizado para usar o contexto de favoritos
 * Facilita o acesso ao contexto em qualquer componente
 */
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  return context;
};

/**
 * Provider do contexto de favoritos
 * Gerencia o estado dos favoritos e persiste no AsyncStorage
 */
export const FavoritesProvider = ({ children }) => {
  // Estado que armazena a lista de filmes favoritos
  const [favorites, setFavorites] = useState([]);
  // Estado de carregamento
  const [loading, setLoading] = useState(true);

  /**
   * Carrega os favoritos do AsyncStorage quando o app inicia
   * useEffect com array vazio [] executa apenas uma vez (componentDidMount)
   */
  useEffect(() => {
    loadFavorites();
  }, []);

  /**
   * Função para carregar favoritos do armazenamento local
   */
  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Salva os favoritos no AsyncStorage
   * @param {Array} favoritesToSave - Lista de favoritos para salvar
   */
  const saveFavorites = async (favoritesToSave) => {
    try {
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(favoritesToSave)
      );
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  };

  /**
   * Adiciona um filme aos favoritos
   * @param {Object} movie - Objeto do filme a ser adicionado
   */
  const addFavorite = (movie) => {
    const newFavorites = [...favorites, movie];
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  /**
   * Remove um filme dos favoritos
   * @param {number} movieId - ID do filme a ser removido
   */
  const removeFavorite = (movieId) => {
    const newFavorites = favorites.filter(movie => movie.id !== movieId);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  /**
   * Verifica se um filme está nos favoritos
   * @param {number} movieId - ID do filme a verificar
   * @returns {boolean} true se o filme está nos favoritos
   */
  const isFavorite = (movieId) => {
    return favorites.some(movie => movie.id === movieId);
  };

  /**
   * Alterna o estado de favorito de um filme
   * @param {Object} movie - Objeto do filme
   */
  const toggleFavorite = (movie) => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  /**
   * Limpa todos os favoritos
   */
  const clearFavorites = async () => {
    setFavorites([]);
    await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
  };

  // Valor do contexto disponibilizado para os componentes filhos
  const value = {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
