import "react-native-get-random-values";
import "./config/amplify";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context/AuthContext";
import AppNavigator from "./navigation/AppNavigator";
import { ChargeProvider } from "./context/ChargeContext";
import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";
import { useContributionNotifications } from "./hooks/useContributionNotification";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const App = () => {
  const { scheduleMonthlyContributionNotifications } =
    useContributionNotifications();

  useEffect(() => {
    scheduleMonthlyContributionNotifications(9, 0);
  }, []);

  return (
    <AuthProvider>
      <ChargeProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
        <Toast />
      </ChargeProvider>
    </AuthProvider>
  );
};
