import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/Button';

export const DashboardScreen = () => {
  const { logout } = useContext(AuthContext);

  return (
    <View>
      <Text>Dashboard</Text>
      <Button title="Sair" onPress={logout} />
    </View>
  );
};
