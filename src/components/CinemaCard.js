/**
 * Cartão de Cinema
 * Exibe informações de um cinema próximo
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CinemaCard = ({ cinema, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.nome} numberOfLines={2}>
          {cinema.nome}
        </Text>

        <Text style={styles.endereco} numberOfLines={2}>
          📍 {cinema.endereco}
        </Text>

        <View style={styles.footer}>
          <View style={styles.distancia}>
            <Text style={styles.distanciaText}>
              📏 {cinema.distancia} km
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.arrow}>
        <Text style={styles.arrowText}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#e94560',
    overflow: 'hidden',
    paddingRight: 12,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  endereco: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 8,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distancia: {
    backgroundColor: '#1a1a2e',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  distanciaText: {
    color: '#e94560',
    fontSize: 12,
    fontWeight: 'bold',
  },
  arrow: {
    paddingRight: 8,
  },
  arrowText: {
    fontSize: 24,
    color: '#e94560',
  },
});

export default CinemaCard;
