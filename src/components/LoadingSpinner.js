import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const LoadingSpinner = ({ message = 'Carregando...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#e94560" />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
<<<<<<< HEAD
    backgroundColor: 'transparent',
=======
    backgroundColor: '#1a1a2e',
>>>>>>> 674fe7a39a84c7a13d5a3b5caf62d55041eab313
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
  },
});

export default LoadingSpinner;
