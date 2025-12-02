/**
 * Tela de Sorteio de Shows
 * Permite buscar shows manualmente ou usar filtros, adicionar à lista e sortear
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Animated,
  TextInput,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FilterChip from '../components/FilterChip';
import LoadingSpinner from '../components/LoadingSpinner';
import { searchMovies, getFilteredMovies } from '../services/movieService';
import { GENRES, DECADES, getImageUrl, translateGenre } from '../config/api';

const RandomScreen = () => {
  const navigation = useNavigation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedDecade, setSelectedDecade] = useState(null);
  
  const [drawList, setDrawList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const [scaleAnim] = useState(new Animated.Value(0));

  const handleSearch = async () => {
    if (searchQuery.length < 2) {
      setError('Digite pelo menos 2 caracteres');
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      setSearchLoading(true);
      setError(null);
      const data = await searchMovies(searchQuery);
      
      // Remover duplicatas usando Map com ID como chave
      const uniqueResults = Array.from(
        new Map(data.results.map(item => [item.id, item])).values()
      ).slice(0, 20);
      
      setSearchResults(uniqueResults);
      setShowSearchResults(true);
    } catch (err) {
      setError('Erro ao buscar shows.');
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const addToDrawList = (show) => {
    if (drawList.some(item => item.id === show.id)) {
      setError(`"${show.name}" já está na lista!`);
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setDrawList([...drawList, show]);
    setError(null);
    
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const removeFromDrawList = (showId) => {
    setDrawList(drawList.filter(item => item.id !== showId));
  };

  const clearDrawList = () => {
    setDrawList([]);
    setError(null);
  };

  const fetchMoviesWithFilters = async () => {
    if (!selectedGenre && !selectedDecade) {
      setError('Selecione pelo menos um filtro');
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const options = {};
      if (selectedGenre) options.genre = selectedGenre;
      if (selectedDecade) options.decade = selectedDecade;
      
      const data = await getFilteredMovies(options);
      
      const goodShows = data.results.filter(show => 
        show.rating && show.rating.average && show.rating.average > 5
      );
      
      if (goodShows.length === 0) {
        setError('Nenhum show encontrado com esses filtros. Tente outros!');
        setTimeout(() => setError(null), 3000);
        return;
      }
      
      // Remove duplicatas usando Map
      const uniqueShows = Array.from(
        new Map(goodShows.map(item => [item.id, item])).values()
      );
      
      const newShows = uniqueShows.filter(show => 
        !drawList.some(item => item.id === show.id)
      );
      
      if (newShows.length === 0) {
        setError('Todos os shows desses filtros já estão na lista!');
        setTimeout(() => setError(null), 3000);
        return;
      }
      
      setDrawList([...drawList, ...newShows.slice(0, 10)]);
      setError(null);
    } catch (err) {
      setError('Erro ao buscar shows. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDraw = () => {
    if (drawList.length === 0) {
      setError('Adicione shows à lista antes de sortear!');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const randomIndex = Math.floor(Math.random() * drawList.length);
    const show = drawList[randomIndex];
    
    setSelectedMovie(show);
    setShowModal(true);
    
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowModal(false);
      setSelectedMovie(null);
    });
  };

  const viewDetails = () => {
    closeModal();
    navigation.navigate('Details', { movieId: selectedMovie.id });
  };

  const drawAgain = () => {
    closeModal();
    setTimeout(() => handleDraw(), 300);
  };

  const clearFilters = () => {
    setSelectedGenre(null);
    setSelectedDecade(null);
    setError(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Seção de Busca */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Buscar Shows</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Digite o nome do show..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={handleSearch}
              disabled={searchLoading}
            >
              <Text style={styles.searchButtonText}>
                {searchLoading ? '⏳' : '🔍'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Resultados da busca */}
          {showSearchResults && searchResults.length > 0 && (
            <View style={styles.searchResultsContainer}>
              <View style={styles.searchResultsHeader}>
                <Text style={styles.searchResultsTitle}>
                  {searchResults.length} resultado(s)
                </Text>
                <TouchableOpacity onPress={() => setShowSearchResults(false)}>
                  <Text style={styles.closeSearchResults}>Fechar</Text>
                </TouchableOpacity>
              </View>
              <ScrollView 
                style={styles.searchResultsList}
                nestedScrollEnabled={true}
              >
                {searchResults.map((item, index) => (
                  <TouchableOpacity
                    key={`search-${item.id}-${index}`}
                    style={styles.searchResultItem}
                    onPress={() => addToDrawList(item)}
                  >
                    {item.image ? (
                      <Image
                        source={{ uri: getImageUrl(item.image, 'medium') }}
                        style={styles.searchResultImage}
                      />
                    ) : (
                      <View style={[styles.searchResultImage, styles.placeholderImage]}>
                        <Text style={styles.placeholderText}>🎬</Text>
                      </View>
                    )}
                    <View style={styles.searchResultInfo}>
                      <Text style={styles.searchResultTitle} numberOfLines={2}>
                        {item.name}
                      </Text>
                      <Text style={styles.searchResultRating}>
                        ⭐ {item.rating?.average?.toFixed(1) || 'N/A'}
                      </Text>
                    </View>
                    <Text style={styles.addButton}>+</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Seção de Filtros */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ou use filtros</Text>
          <Text style={styles.sectionSubtitle}>Escolha um Gênero</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContainer}
          >
            {GENRES.map((genre) => (
              <FilterChip
                key={genre}
                label={translateGenre(genre)}
                selected={selectedGenre === genre}
                onPress={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Seção de Décadas */}
        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Escolha uma Década</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContainer}
          >
            {DECADES.map((decade) => (
              <FilterChip
                key={decade.label}
                label={decade.label}
                selected={selectedDecade?.label === decade.label}
                onPress={() => setSelectedDecade(selectedDecade?.label === decade.label ? null : decade)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Botão de adicionar shows por filtro */}
        {(selectedGenre || selectedDecade) && (
          <View style={styles.filterActions}>
            <TouchableOpacity
              style={styles.addFiltersButton}
              onPress={fetchMoviesWithFilters}
              disabled={loading}
            >
              <Text style={styles.addFiltersButtonText}>
                {loading ? '⏳ Buscando...' : '+ Adicionar Shows à Lista'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={clearFilters}
            >
              <Text style={styles.clearFiltersButtonText}>Limpar Filtros</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Lista de Shows para Sorteio */}
        {drawList.length > 0 && (
          <View style={styles.section}>
            <View style={styles.drawListHeader}>
              <Text style={styles.sectionTitle}>
                Lista de Sorteio ({drawList.length})
              </Text>
              <TouchableOpacity onPress={clearDrawList}>
                <Text style={styles.clearListText}>Limpar Tudo</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.drawList}>
              {drawList.map((item, index) => (
                <View 
                  key={`draw-${item.id}-${index}`}
                  style={styles.drawListItem}
                >
                  {item.image ? (
                    <Image
                      source={{ uri: getImageUrl(item.image, 'medium') }}
                      style={styles.drawListImage}
                    />
                  ) : (
                    <View style={[styles.drawListImage, styles.placeholderImage]}>
                      <Text style={styles.placeholderText}>🎬</Text>
                    </View>
                  )}
                  <View style={styles.drawListInfo}>
                    <Text style={styles.drawListTitle} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.drawListRating}>
                      ⭐ {item.rating?.average?.toFixed(1) || 'N/A'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeFromDrawList(item.id)}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Mensagens de Erro */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Informações */}
        {drawList.length === 0 && !showSearchResults && (
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>🎲</Text>
            <Text style={styles.infoText}>
              Busque shows ou use filtros para adicionar à lista de sorteio!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Botão Flutuante de Sorteio */}
      <TouchableOpacity
        style={[styles.drawButton, drawList.length === 0 && styles.drawButtonDisabled]}
        onPress={handleDraw}
        disabled={drawList.length === 0}
      >
        <Text style={styles.drawButtonText}>
          🎲 Sortear Show {drawList.length > 0 && `(${drawList.length})`}
        </Text>
      </TouchableOpacity>

      {/* Modal de resultado */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {selectedMovie && (
              <>
                <Text style={styles.modalTitle}>🎉 Show Sorteado! 🎉</Text>
                
                {selectedMovie.image && (
                  <Image
                    source={{ uri: getImageUrl(selectedMovie.image, 'medium') }}
                    style={styles.modalPoster}
                    resizeMode="cover"
                  />
                )}
                
                <Text style={styles.modalMovieTitle}>{selectedMovie.name}</Text>
                
                <View style={styles.modalInfo}>
                  <Text style={styles.modalRating}>
                    ⭐ {selectedMovie.rating?.average?.toFixed(1) || 'N/A'}
                  </Text>
                  {selectedMovie.premiered && (
                    <Text style={styles.modalYear}>
                      {new Date(selectedMovie.premiered).getFullYear()}
                    </Text>
                  )}
                </View>

                {selectedMovie.summary && (
                  <Text style={styles.modalOverview} numberOfLines={4}>
                    {selectedMovie.summary.replace(/<[^>]*>/g, '')}
                  </Text>
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonSecondary]}
                    onPress={drawAgain}
                  >
                    <Text style={styles.modalButtonText}>Sortear Outro</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    onPress={viewDetails}
                  >
                    <Text style={styles.modalButtonText}>Ver Detalhes</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  section: {
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ccc',
    marginBottom: 8,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#2d2d44',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#e94560',
    borderRadius: 8,
    paddingHorizontal: 20,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 20,
  },
  searchResultsContainer: {
    marginTop: 12,
    marginHorizontal: 16,
    backgroundColor: '#2d2d44',
    borderRadius: 8,
    padding: 12,
  },
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchResultsTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  closeSearchResults: {
    color: '#e94560',
    fontSize: 14,
    fontWeight: '600',
  },
  searchResultsList: {
    maxHeight: 450,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  searchResultImage: {
    width: 50,
    height: 75,
    borderRadius: 4,
  },
  placeholderImage: {
    backgroundColor: '#16213e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
  },
  searchResultInfo: {
    flex: 1,
    marginLeft: 12,
  },
  searchResultTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  searchResultRating: {
    color: '#ccc',
    fontSize: 12,
  },
  addButton: {
    color: '#e94560',
    fontSize: 32,
    fontWeight: '300',
    paddingHorizontal: 12,
  },
  chipsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  filterActions: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  addFiltersButton: {
    backgroundColor: '#e94560',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  addFiltersButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  clearFiltersButton: {
    backgroundColor: '#2d2d44',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearFiltersButtonText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '600',
  },
  drawListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  clearListText: {
    color: '#e94560',
    fontSize: 14,
    fontWeight: '600',
  },
  drawList: {
    marginHorizontal: 16,
  },
  drawListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d44',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  drawListImage: {
    width: 40,
    height: 60,
    borderRadius: 4,
  },
  drawListInfo: {
    flex: 1,
    marginLeft: 12,
  },
  drawListTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  drawListRating: {
    color: '#ccc',
    fontSize: 12,
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    color: '#e94560',
    fontSize: 20,
    fontWeight: '700',
  },
  errorContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    backgroundColor: '#e94560',
    borderRadius: 8,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  infoBox: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 100,
    padding: 16,
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  infoText: {
    color: '#ccc',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  drawButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#e94560',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  drawButtonDisabled: {
    backgroundColor: '#5a5a6e',
  },
  drawButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2d2d44',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e94560',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalPoster: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalMovieTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalRating: {
    fontSize: 16,
    color: '#ffd700',
    fontWeight: '600',
  },
  modalYear: {
    fontSize: 16,
    color: '#ccc',
    marginLeft: 12,
  },
  modalOverview: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonSecondary: {
    backgroundColor: '#16213e',
    marginRight: 8,
  },
  modalButtonPrimary: {
    backgroundColor: '#e94560',
    marginLeft: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '400',
  },
});

export default RandomScreen;
