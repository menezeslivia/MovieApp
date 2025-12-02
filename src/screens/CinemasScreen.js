/**
 * Tela de Cinemas Próximos com OpenStreetMap
 * Totalmente GRATUITO e sem registro!
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import * as Location from 'expo-location';
import CinemaCard from '../components/CinemaCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import {
  getNearbyMovieTheaters,
  filterCinemasByName,
  filterCinemasByDistance,
  searchCinemasByCity,
} from '../services/cinemaService';

const CinemasScreen = () => {
  // Estados
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [raioKm, setRaioKm] = useState(5);
  const [modoBusca, setModoBusca] = useState('localizacao'); // 'localizacao' ou 'cidade'
  const [cidadeBusca, setCidadeBusca] = useState('');

  /**
   * Carrega cinemas ao montar o componente ou quando muda o raio
   */
  useEffect(() => {
    if (modoBusca === 'localizacao') {
      carregarCinemas();
    }
  }, [modoBusca, raioKm]);

  /**
   * Carrega cinemas próximos
   */
  const carregarCinemas = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Solicitar permissão de localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permissão de localização negada. Por favor, autorize nos configurações.');
        setLoading(false);
        return;
      }

      // 2. Obter localização do usuário
      const userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation(userLocation.coords);

      // 3. Buscar cinemas próximos
      const cinemasBuscados = await getNearbyMovieTheaters(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        raioKm
      );

      if (cinemasBuscados.length === 0) {
        setError(
          `Nenhum cinema encontrado dentro de ${raioKm}km. Tente aumentar o raio de busca.`
        );
        setCinemas([]);
      } else {
        setCinemas(cinemasBuscados);
      }
    } catch (err) {
      console.error('Erro ao carregar cinemas:', err);
      setError('Erro ao buscar cinemas. Verifique sua conexão de internet.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Busca cinemas por cidade
   */
  const buscarCinemasPorCidade = async () => {
    if (!cidadeBusca.trim()) {
      setError('Por favor, digite o nome da cidade');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const cinemasBuscados = await searchCinemasByCity(cidadeBusca);

      if (cinemasBuscados.length === 0) {
        setError(`Nenhum cinema encontrado em ${cidadeBusca}`);
        setCinemas([]);
      } else {
        setCinemas(cinemasBuscados);
      }
    } catch (err) {
      console.error('Erro ao buscar cinemas por cidade:', err);
      setError(err.message || 'Erro ao buscar cinemas. Verifique o nome da cidade.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Atualizar lista
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await carregarCinemas();
    setRefreshing(false);
  };

  /**
   * Filtrar cinemas por busca
   */
  const getCinemasFiltrados = () => {
    let resultado = cinemas;

    if (searchTerm.trim()) {
      resultado = filterCinemasByName(resultado, searchTerm);
    }

    return resultado;
  };

  /**
   * Navegar para detalhes do cinema
   */
  const abrirDetalhes = (cinema) => {
    Alert.alert(cinema.nome, `${cinema.endereco}\n\nDistância: ${cinema.distancia}km`, [
      {
        text: 'Fechar',
        onPress: () => {},
      },
      {
        text: 'Copiar Endereço',
        onPress: () => {
          // Aqui você poderia copiar para clipboard
          Alert.alert('Endereço copiado!', cinema.endereco);
        },
      },
    ]);
  };

  /**
   * Renderiza item da lista
   */
  const renderItem = ({ item }) => (
    <CinemaCard cinema={item} onPress={() => abrirDetalhes(item)} />
  );

  /**
   * Renderiza header - memorizado para evitar perda de foco do TextInput
   */
  const renderListHeader = React.useMemo(() => {
    const cinemasFiltrados = getCinemasFiltrados();
    return (
      <View style={styles.header}>
        {/* Abas de modo de busca */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              modoBusca === 'localizacao' && styles.tabActive,
            ]}
            onPress={() => setModoBusca('localizacao')}
          >
            <Text style={[
              styles.tabText,
              modoBusca === 'localizacao' && styles.tabTextActive,
            ]}>
              📍 Perto de mim
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              modoBusca === 'cidade' && styles.tabActive,
            ]}
            onPress={() => setModoBusca('cidade')}
          >
            <Text style={[
              styles.tabText,
              modoBusca === 'cidade' && styles.tabTextActive,
            ]}>
              🏙️ Por cidade
            </Text>
          </TouchableOpacity>
        </View>

        {modoBusca === 'localizacao' ? (
          // Modo de localização
          <>
            {location && (
              <Text style={styles.locationText}>
                📍 Você está em: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </Text>
            )}

            <TextInput
              style={styles.searchInput}
              placeholder="🔍 Buscar cinema..."
              placeholderTextColor="#666"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />

            <View style={styles.raioContainer}>
              <Text style={styles.raioLabel}>Raio de busca:</Text>
              <View style={styles.raioButtons}>
                {[5, 10, 15].map(km => (
                  <TouchableOpacity
                    key={km}
                    style={[
                      styles.raioButton,
                      raioKm === km && styles.raioButtonActive,
                    ]}
                    onPress={() => {
                      setRaioKm(km);
                      // Recarregar cinemas com novo raio
                    }}
                  >
                    <Text
                      style={[
                        styles.raioButtonText,
                        raioKm === km && styles.raioButtonTextActive,
                      ]}
                    >
                      {km}km
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          // Modo de busca por cidade
          <>
            <TextInput
              style={styles.searchInput}
              placeholder="🏙️ Digite a cidade..."
              placeholderTextColor="#666"
              value={cidadeBusca}
              onChangeText={setCidadeBusca}
              editable={true}
            />

            <TouchableOpacity
              style={styles.searchButton}
              onPress={buscarCinemasPorCidade}
            >
              <Text style={styles.searchButtonText}>
                🔍 Buscar em {cidadeBusca || 'outra cidade'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.resultsCount}>
          {cinemasFiltrados.length} cinema{cinemasFiltrados.length !== 1 ? 's' : ''} encontrado{cinemasFiltrados.length !== 1 ? 's' : ''}
        </Text>
      </View>
    );
  }, [modoBusca, location, searchTerm, raioKm, cidadeBusca, cinemas]);

  // Renderização condicional
  if (loading && cinemas.length === 0) {
    return <LoadingSpinner message="🔍 Buscando cinemas próximos..." />;
  }

  if (error && cinemas.length === 0) {
    return (
      <ErrorMessage
        message={error}
        onRetry={carregarCinemas}
      />
    );
  }

  const cinemasFiltrados = getCinemasFiltrados();

  return (
    <View style={styles.container}>
      <FlatList
        data={cinemasFiltrados}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={
          <EmptyState
            message={searchTerm ? 'Nenhum cinema corresponde à busca' : 'Nenhum cinema encontrado'}
            icon="🎬"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#e94560']}
            tintColor="#e94560"
          />
        }
      />

      {/* Loading spinner quando carregando com novo raio */}
      {loading && cinemas.length > 0 && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner message="Atualizando cinemas..." />
        </View>
      )}
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
  header: {
    marginBottom: 16,
  },
  locationText: {
    color: '#999',
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  searchInput: {
    backgroundColor: '#2d2d44',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  raioContainer: {
    marginBottom: 12,
  },
  raioLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  raioButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  raioButton: {
    backgroundColor: '#2d2d44',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#444',
    flex: 1,
    alignItems: 'center',
  },
  raioButtonActive: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  raioButtonText: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: 'bold',
  },
  raioButtonTextActive: {
    color: '#fff',
  },
  resultsCount: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    backgroundColor: '#2d2d44',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  tabActive: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  tabText: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: '#fff',
  },
  searchButton: {
    backgroundColor: '#e94560',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.13)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CinemasScreen;
