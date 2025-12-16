import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/AuthContext";
import { LoginScreen } from "../screens/LoginScreen";
import { BottomTabs } from "../components/ButtonTabs";
import { LoadingScreen } from "../screens/LoadingScreen";

const Stack = createNativeStackNavigator();
const AppNavigator = () => {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingScreen title="Aguarde..." />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <Stack.Screen name="Home" component={BottomTabs} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
