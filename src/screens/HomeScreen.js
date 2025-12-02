/**
 * Tela Home - Lista de filmes populares
 * Tela principal do aplicativo que exibe filmes populares e em alta
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { getPopularMovies, searchMovies, getTrendingMovies } from '../services/movieService';

/**
 * Componente da tela Home
 */
const HomeScreen = () => {
  const navigation = useNavigation();
  
  // Estados
  const [movies, setMovies] = useState([]); // Lista de filmes
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [refreshing, setRefreshing] = useState(false); // Estado de refresh
  const [error, setError] = useState(null); // Estado de erro
  const [searchQuery, setSearchQuery] = useState(''); // Query de busca
  const [page, setPage] = useState(1); // Página atual
  const [showTrending, setShowTrending] = useState(false); // Alternar entre popular e trending

  /**
   * Carrega filmes ao montar o componente
   */
  useEffect(() => {
    loadMovies();
  }, [showTrending]);

  /**
   * Função para carregar filmes
   */
  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = showTrending 
        ? await getTrendingMovies(1)
        : await getPopularMovies(1);
      
      setMovies(data.results);
      setPage(1);
    } catch (err) {
      setError('Erro ao carregar filmes. Verifique sua conexão.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Função de pull-to-refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await loadMovies();
    setRefreshing(false);
  };

  /**
   * Função de busca
   * @param {string} query - Termo de busca
   */
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.length === 0) {
      loadMovies();
      return;
    }

    if (query.length < 3) return;

    try {
      setLoading(true);
      setError(null);
      const data = await searchMovies(query);
      setMovies(data.results);
    } catch (err) {
      setError('Erro ao buscar filmes.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carrega mais filmes (paginação)
   */
  const loadMore = async () => {
    if (searchQuery) return; // Não paginar em buscas

    try {
      const nextPage = page + 1;
      const data = showTrending 
        ? await getTrendingMovies(nextPage)
        : await getPopularMovies(nextPage);
      
      setMovies([...movies, ...data.results]);
      setPage(nextPage);
    } catch (err) {
      console.error('Erro ao carregar mais filmes:', err);
    }
  };

  /**
   * Navega para tela de detalhes do filme
   * @param {Object} movie - Dados do filme
   */
  const navigateToDetails = (movie) => {
    navigation.navigate('Details', { movieId: movie.id });
  };

  /**
   * Renderiza cada item da lista
   */
  const renderItem = ({ item }) => (
    <MovieCard movie={item} onPress={() => navigateToDetails(item)} />
  );

  /**
   * Componente de header da lista
   */
  const ListHeaderComponent = () => (
    <View style={styles.header}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, !showTrending && styles.toggleButtonActive]}
          onPress={() => setShowTrending(false)}
        >
          <Text style={[styles.toggleText, !showTrending && styles.toggleTextActive]}>
            Populares
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, showTrending && styles.toggleButtonActive]}
          onPress={() => setShowTrending(true)}
        >
          <Text style={[styles.toggleText, showTrending && styles.toggleTextActive]}>
            Em Alta
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Renderização condicional baseada no estado
  if (loading && movies.length === 0) {
    return <LoadingSpinner message="Carregando filmes..." />;
  }

  if (error && movies.length === 0) {
    return <ErrorMessage message={error} onRetry={loadMovies} />;
  }

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} />
      
      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={searchQuery ? null : ListHeaderComponent}
        ListEmptyComponent={
          <EmptyState message="Nenhum filme encontrado" icon="🎬" />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#e94560']}
            tintColor="#e94560"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#e94560',
  },
  toggleText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: 'bold',
  },
  toggleTextActive: {
    color: '#fff',
  },
});

export default HomeScreen;
