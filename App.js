/**
 * App.js - Componente Principal do Aplicativo
 * 
 * Este é o ponto de entrada do aplicativo MovieApp.
 * Configura os providers necessários e renderiza a navegação principal.
 * 
 * Estrutura:
 * - FavoritesProvider: Gerencia estado de favoritos globalmente
 * - AppNavigator: Gerencia a navegação entre telas
 * - StatusBar: Configura a barra de status
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FavoritesProvider } from './src/context/FavoritesContext';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * Componente principal do aplicativo
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <View style={styles.container}>
          <StatusBar style="light" backgroundColor="#16213e" />
          <AppNavigator />
        </View>
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
});
