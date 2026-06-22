import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "@/context/AuthContext";
import { LoginScreen } from "@/screens/LoginScreen";
import { RegisterScreen } from "@/screens/RegisterScreen";
import { BottomTabs } from "@/components/BottonTabs";
import { RootStackParamList } from "@/navigation/types";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { VideosScreen } from "@/screens/VideosScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isLoggedIn, member, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
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
