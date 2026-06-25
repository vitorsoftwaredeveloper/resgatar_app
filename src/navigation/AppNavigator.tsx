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
import { PersonalSettingsScreen } from "@/screens/PersonalSettingsScreen";
import { MemberActionsScreen } from "@/screens/MemberActionsScreen";
import { OnboardingScreen } from "@/screens/OnboardingScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const {
    isLoggedIn,
    member,
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
            {() => <BottomTabs isAdmin={member?.role === "admin"} />}
          </Stack.Screen>
          <Stack.Screen name="Videos" component={VideosScreen} />
          <Stack.Screen name="Arrecadacao" component={ArrecadacaoScreen} />
          <Stack.Screen name="BalancoAnual" component={BalancoAnualScreen} />
          <Stack.Screen name="PersonalSettings" component={PersonalSettingsScreen} />
          <Stack.Screen name="MemberActions" component={MemberActionsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
