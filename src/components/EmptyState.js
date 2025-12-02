import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EmptyState = ({ message = 'Nenhum resultado encontrado', icon = '🎬' }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
});

export default EmptyState;
