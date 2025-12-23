import "./config/amplify";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context/AuthContext";
import AppNavigator from "./navigation/AppNavigator";
import { ChargeProvider } from "./context/ChargeContext";
import { LoadingProvider } from "./context/LoadingContext";
import Toast from "react-native-toast-message";

export const App = () => {
  return (
    <AuthProvider>
      <ChargeProvider>
        <LoadingProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
          <Toast />
        </LoadingProvider>
      </ChargeProvider>
    </AuthProvider>
  );
};
