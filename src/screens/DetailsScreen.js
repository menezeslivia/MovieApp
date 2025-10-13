/**
 * Tela de Detalhes do Filme
 * Exibe informações completas sobre um filme específico
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { getMovieDetails } from '../services/movieService';
import { getImageUrl, translateGenre } from '../config/api';
import { useFavorites } from '../context/FavoritesContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const { width } = Dimensions.get('window');

/**
 * Componente da tela de detalhes
 */
const DetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { movieId } = route.params;
  const { isFavorite, toggleFavorite } = useFavorites();

  // Estados
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Carrega detalhes do filme
   */
  useEffect(() => {
    loadMovieDetails();
  }, [movieId]);

  /**
   * Função para carregar detalhes
   */
  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMovieDetails(movieId);
      setMovie(data);
    } catch (err) {
      setError('Erro ao carregar detalhes do filme.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Alterna favorito
   */
  const handleToggleFavorite = () => {
    if (movie) {
      toggleFavorite(movie);
    }
  };

  // Estados de carregamento e erro
  if (loading) {
    return <LoadingSpinner message="Carregando detalhes..." />;
  }

  if (error || !movie) {
    return <ErrorMessage message={error} onRetry={loadMovieDetails} />;
  }

  // TVMaze usa estrutura diferente: movie.image.original e movie.image.medium
  const backdropUrl = getImageUrl(movie.image, 'original');
  const posterUrl = getImageUrl(movie.image, 'medium');
  const isFav = isFavorite(movie.id);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header com imagem de fundo */}
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: backdropUrl }}
          style={styles.backdrop}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', '#1a1a2e']}
          style={styles.gradient}
        />
        
        {/* Botão de voltar e favorito */}
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.iconText}>←</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleToggleFavorite}
          >
            <Text style={styles.iconText}>{isFav ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Conteúdo principal */}
      <View style={styles.content}>
        {/* Poster e informações principais */}
        <View style={styles.mainInfo}>
          <Image
            source={{ uri: posterUrl }}
            style={styles.poster}
            resizeMode="cover"
          />
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{movie.name}</Text>
            {movie.originalName && movie.originalName !== movie.name && (
              <Text style={styles.originalTitle}>{movie.originalName}</Text>
            )}
            
            <View style={styles.metaInfo}>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>
                  ⭐ {movie.rating?.average ? movie.rating.average.toFixed(1) : 'N/A'}
                </Text>
              </View>
              
              <Text style={styles.releaseDate}>
                {movie.premiered ? new Date(movie.premiered).getFullYear() : 'N/A'}
              </Text>
            </View>

            {movie.runtime && (
              <Text style={styles.runtime}>⏱️ {movie.runtime} min</Text>
            )}
            {movie.status && (
              <Text style={styles.status}>📺 {movie.status}</Text>
            )}
          </View>
        </View>

        {/* Gêneros */}
        {movie.genres && movie.genres.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gêneros</Text>
            <View style={styles.genres}>
              {movie.genres.map((genre, index) => (
                <View key={index} style={styles.genreChip}>
                  <Text style={styles.genreText}>{translateGenre(genre)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Sinopse */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sinopse</Text>
          <Text style={styles.overview}>
            {movie.summary 
              ? movie.summary.replace(/<[^>]*>/g, '') // Remove tags HTML
              : 'Sinopse não disponível.'}
          </Text>
        </View>

        {/* Elenco */}
        {movie.credits?.cast?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Elenco Principal</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {movie.credits.cast.slice(0, 10).map((actor) => (
                <View key={actor.id} style={styles.castCard}>
                  {actor.profile_path ? (
                    <Image
                      source={{ uri: actor.profile_path }}
                      style={styles.castImage}
                    />
                  ) : (
                    <View style={[styles.castImage, styles.placeholderImage]}>
                      <Text style={styles.placeholderText}>
                        {actor.name.charAt(0)}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.castName} numberOfLines={1}>
                    {actor.name}
                  </Text>
                  <Text style={styles.castCharacter} numberOfLines={1}>
                    {actor.character}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Informações adicionais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>
          
          {movie.network && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Rede:</Text>
              <Text style={styles.infoValue}>{movie.network.name}</Text>
            </View>
          )}

          {movie.premiered && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Estreia:</Text>
              <Text style={styles.infoValue}>
                {new Date(movie.premiered).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          )}

          {movie.status && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={styles.infoValue}>{movie.status}</Text>
            </View>
          )}

          {movie.language && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Idioma:</Text>
              <Text style={styles.infoValue}>{movie.language.toUpperCase()}</Text>
            </View>
          )}

          {movie.officialSite && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Site Oficial:</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {movie.officialSite.replace(/^https?:\/\//, '')}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  headerContainer: {
    position: 'relative',
    height: 250,
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  headerButtons: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  mainInfo: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: '#2d2d44',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  originalTitle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 12,
  },
  metaInfo: {
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 18,
    color: '#ffd700',
    fontWeight: 'bold',
    marginRight: 8,
  },
  voteCount: {
    fontSize: 12,
    color: '#aaa',
  },
  releaseDate: {
    fontSize: 14,
    color: '#aaa',
  },
  runtime: {
    fontSize: 14,
    color: '#aaa',
  },
  status: {
    fontSize: 14,
    color: '#51cf66',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreChip: {
    backgroundColor: '#e94560',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  overview: {
    fontSize: 14,
    color: '#ddd',
    lineHeight: 22,
  },
  castCard: {
    width: 100,
    marginRight: 12,
  },
  castImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2d2d44',
    marginBottom: 8,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e94560',
  },
  placeholderText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  castName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  castCharacter: {
    fontSize: 11,
    color: '#aaa',
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d44',
  },
  infoLabel: {
    fontSize: 14,
    color: '#aaa',
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DetailsScreen;
