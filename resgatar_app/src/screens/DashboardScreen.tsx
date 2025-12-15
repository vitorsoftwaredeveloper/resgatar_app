// src/app/dashboard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../components/Button'; // Importa o nosso componente Button

export const  DashboardScreen = () => {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24, // Adiciona um espaço abaixo do título
  },
});