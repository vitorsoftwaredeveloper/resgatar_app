import { NavigationContainer } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import React, { useContext } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-get-random-values";
import Toast from "react-native-toast-message";
import { toastConfig } from "./components/Toast/toastConfig";
import "./config/amplify";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { ChargeProvider } from "./context/ChargeContext";
import { ThemeProvider } from "./context/ThemeContext";
import { usePushNotifications } from "./hooks/usePushNotifications";
import AppNavigator from "./navigation/AppNavigator";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

Notifications.cancelAllScheduledNotificationsAsync();

const AppContent = () => {
  const { isLoggedIn } = useContext(AuthContext);

  usePushNotifications(isLoggedIn);

  return (
    <ChargeProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ChargeProvider>
  );
};

export const App = () => {
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
        <Toast config={toastConfig} />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};
