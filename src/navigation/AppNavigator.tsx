import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "@/context/AuthContext";
import { LoginScreen } from "@/screens/LoginScreen";
import { RegisterScreen } from "@/screens/RegisterScreen";
import { BottomTabs } from "@/components/BottonTabs";
import { RootStackParamList } from "@/navigation/types";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { VideosScreen } from "@/screens/VideosScreen";
import { ArrecadacaoScreen } from "@/screens/ArrecadacaoScreen";
import { BalancoAnualScreen } from "@/screens/BalancoAnualScreen";
import { ExpensesScreen } from "@/screens/ExpensesScreen";
import { DonationsScreen } from "@/screens/DonationsScreen";
import { PersonalSettingsScreen } from "@/screens/PersonalSettingsScreen";
import { MemberActionsScreen } from "@/screens/MemberActionsScreen";
import { OnboardingScreen } from "@/screens/OnboardingScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";
import { NoticeBoardScreen } from "@/screens/NoticeBoardScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const {
    isLoggedIn,
    loading,
    needsOnboarding,
    onboardingChecked,
    completeOnboarding,
  } = useContext(AuthContext);

  if (loading || (isLoggedIn && !onboardingChecked)) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : needsOnboarding ? (
        <Stack.Screen name="Onboarding">
          {() => <OnboardingScreen onDone={completeOnboarding} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Home">
            {() => <BottomTabs />}
          </Stack.Screen>
          <Stack.Screen name="Videos" component={VideosScreen} />
          <Stack.Screen name="NoticeBoard" component={NoticeBoardScreen} />
          <Stack.Screen name="Arrecadacao" component={ArrecadacaoScreen} />
          <Stack.Screen name="BalancoAnual" component={BalancoAnualScreen} />
          <Stack.Screen name="Expenses" component={ExpensesScreen} />
          <Stack.Screen name="Donations" component={DonationsScreen} />
          <Stack.Screen name="PersonalSettings" component={PersonalSettingsScreen} />
          <Stack.Screen name="MemberActions" component={MemberActionsScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
