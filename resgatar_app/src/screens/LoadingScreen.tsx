import React from "react";
import { View, Text, ActivityIndicator, SafeAreaView } from "react-native";

interface ILoadingProps {
  title: string;
}
export const LoadingScreen = ({ title }: ILoadingProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo ou Ícone do App */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🚀</Text>
        </View>

        {/* App Name */}
        <Text style={styles.appName}>{title}</Text>

        {/* Loading Indicator */}
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />

        {/* Loading Text */}
        {/* <Text style={styles.loadingText}>Carregando...</Text> */}
      </View>
    </SafeAreaView>
  );
};

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoText: {
    fontSize: 48,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 48,
  },
  loader: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
});

export default styles;
