import React, { useContext, useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "@/context/AuthContext";
import { LoginScreen } from "@/screens/LoginScreen";
import { RegisterScreen } from "@/screens/RegisterScreen";
import { BottomTabs } from "@/components/BottonTabs";
import { RootStackParamList } from "@/navigation/types";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { VideosScreen } from "@/screens/VideosScreen";
import { OnboardingScreen } from "@/screens/OnboardingScreen";
import { getOnboardingSeen, setOnboardingSeen } from "@/storage/asyncStorage";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isLoggedIn, member, loading } = useContext(AuthContext);

  const memberId = member?._id;
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    let active = true;

    if (!memberId) {
      setOnboardingChecked(false);
      setNeedsOnboarding(false);
      return;
    }

    (async () => {
      const seen = await getOnboardingSeen(memberId);
      if (active) {
        setNeedsOnboarding(!seen);
        setOnboardingChecked(true);
      }
    })();

    return () => {
      active = false;
    };
  }, [memberId]);

  async function completeOnboarding() {
    if (memberId) {
      await setOnboardingSeen(memberId);
    }
    setNeedsOnboarding(false);
  }

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
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
