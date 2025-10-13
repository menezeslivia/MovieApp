import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { getImageUrl } from '../config/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const MovieCard = ({ movie, onPress }) => {
  // TVMaze usa movie.image (objeto) em vez de movie.poster_path
  const imageUrl = getImageUrl(movie.image, 'medium');
  
  // TVMaze usa movie.name em vez de movie.title
  const title = movie.name || movie.title || 'Sem título';
  
  // TVMaze usa movie.rating.average em vez de movie.vote_average
  const rating = movie.rating?.average || movie.vote_average || 0;
  
  // TVMaze usa movie.premiered em vez de movie.release_date
  const year = movie.premiered 
    ? new Date(movie.premiered).getFullYear() 
    : movie.release_date 
      ? new Date(movie.release_date).getFullYear()
      : '';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.poster}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.poster, styles.placeholderPoster]}>
          <Text style={styles.placeholderText}>🎬</Text>
        </View>
      )}
      
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>
            ⭐ {rating ? rating.toFixed(1) : 'N/A'}
          </Text>
          <Text style={styles.year}>{year}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: 16,
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  poster: {
    width: '100%',
    height: CARD_WIDTH * 1.5, // Proporção 2:3 para posters
    backgroundColor: '#1a1a2e',
  },
  placeholderPoster: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2d2d44',
  },
  placeholderText: {
    fontSize: 60,
    opacity: 0.3,
  },
  info: {
    padding: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#ffd700',
    fontWeight: 'bold',
  },
  year: {
    fontSize: 12,
    color: '#aaa',
  },
});

export default MovieCard;
