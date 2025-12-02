/**
 * Tela de Favoritos
 * Exibe lista de filmes marcados como favoritos pelo usuário
 */

import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFavorites } from '../context/FavoritesContext';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

/**
 * Componente da tela de favoritos
 */
const FavoritesScreen = () => {
  const navigation = useNavigation();
  const { favorites, loading, clearFavorites } = useFavorites();

  /**
   * Navega para tela de detalhes
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
   * Header com contador e botão de limpar
   */
  const ListHeaderComponent = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>
        {favorites.length} {favorites.length === 1 ? 'Favorito' : 'Favoritos'}
      </Text>
      {favorites.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearFavorites}
        >
          <Text style={styles.clearButtonText}>Limpar Todos</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return <LoadingSpinner message="Carregando favoritos..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={favorites.length > 0 ? styles.row : null}
        contentContainerStyle={[
          styles.listContent,
          favorites.length === 0 && styles.emptyContent,
        ]}
        ListHeaderComponent={favorites.length > 0 ? ListHeaderComponent : null}
        ListEmptyComponent={
          <EmptyState
            message="Você ainda não tem favoritos. Adicione filmes que você gosta!"
            icon="💝"
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
  emptyContent: {
    flex: 1,
  },
  row: {
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e94560',
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default FavoritesScreen;
