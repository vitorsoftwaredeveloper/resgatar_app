import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { AuthContext } from "@/context/AuthContext";
import { Mail, Lock, EyeIcon, EyeClosed } from "lucide-react-native";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { LoadingContext } from "@/context/LoadingContext";
import { signOut } from "aws-amplify/auth";

export const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const { loading, startLoading, stopLoading } = useContext(LoadingContext);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleCredentialsChange = (field: string, value: string) => {
    setCredentials({
      ...credentials,
      [field]: value,
    });
  };

  const handleLogin = async () => {
    if (!credentials.email || !credentials.password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    try {
      console.log("Iniciando login...");

      await login(credentials.email.trim(), credentials.password);

      console.log("Login realizado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao realizar login:", error);
      Alert.alert(
        "Erro no Login",
        error.message || "Não foi possível fazer login"
      );
      signOut();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá!</Text>

      <Input
        leftIcon={<Mail color="white" />}
        placeholder="Email"
        value={credentials.email}
        onChangeText={(email: string) =>
          handleCredentialsChange("email", email)
        }
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Input
        leftIcon={<Lock color="white" />}
        rightIcon={
          showPassword ? (
            <Button
              title=""
              onPress={() => setShowPassword(!showPassword)}
              // styleCustom={{ paddingVertical: 0, paddingHorizontal: 0 }}
            />
          ) : (
            <Button
              title=""
              // backgroundColor="transparent"
              onPress={() => setShowPassword(!showPassword)}
              // styleCustom={{ paddingVertical: 0, paddingHorizontal: 0 }}
            />
          )
        }
        placeholder="Password"
        value={credentials.password}
        secureTextEntry={!showPassword}
        onChangeText={(password: string) =>
          handleCredentialsChange("password", password)
        }
        autoCapitalize="none"
      />

      <Button
        title={loading ? "Entrando..." : "Entrar"}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#19181F",
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    padding: 32,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#453467",
  },
});
