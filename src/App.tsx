import { NavigationContainer } from "@react-navigation/native";
import {
  CormorantGaramond_500Medium,
  CormorantGaramond_500Medium_Italic,
  CormorantGaramond_600SemiBold,
} from "@expo-google-fonts/cormorant-garamond";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import React, { useContext } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-get-random-values";
import Toast from "react-native-toast-message";
import { toastConfig } from "./components/Toast/toastConfig";
import "./config/amplify";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { ChargeProvider } from "./context/ChargeContext";
import { CoachProvider } from "./context/CoachContext";
import { ThemeProvider } from "./context/ThemeContext";
import { usePushNotifications } from "./hooks/usePushNotifications";
import AppNavigator from "./navigation/AppNavigator";
import { navigationRef } from "./navigation/navigationRef";
import { CoachOverlay } from "./components/CoachOverlay";
import { DevModeGuard } from "./components/DevModeGuard";

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
      <NavigationContainer ref={navigationRef}>
        <CoachProvider>
          <AppNavigator />
          <CoachOverlay />
        </CoachProvider>
      </NavigationContainer>
    </ChargeProvider>
  );
};

export const App = () => {
  // Carrega a face serifada de exibição (Leituras/cards editoriais). Não
  // bloqueia o boot: até carregar, o texto usa a fonte do sistema e re-renderiza
  // quando a fonte fica pronta.
  useFonts({
    CormorantGaramond_500Medium,
    CormorantGaramond_500Medium_Italic,
    CormorantGaramond_600SemiBold,
  });

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DevModeGuard>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
          <Toast config={toastConfig} />
        </DevModeGuard>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};
