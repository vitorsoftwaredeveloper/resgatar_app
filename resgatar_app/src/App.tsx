import "./config/amplify";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context/AuthContext";
import AppNavigator from "./navigation/AppNavigator";
import { ChargeProvider } from "./context/ChargeContext";

export const App = () => {
  return (
    <AuthProvider>
      <ChargeProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ChargeProvider>
    </AuthProvider>
  );
};
