import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Mail, Lock, EyeIcon, EyeClosed } from "lucide-react-native";

export const LoginScreen = () => {
  const { login, loading } = useContext(AuthContext);
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
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá!</Text>

      <Input
        leftIcon={<Mail color="white" />}
        placeholder="Email"
        value={credentials.email}
        onChangeText={(email) => handleCredentialsChange("email", email)}
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
              backgroundColor="transparent"
              onPress={() => setShowPassword(!showPassword)}
              styleCustom={{ paddingVertical: 0, paddingHorizontal: 0 }}
            >
              <EyeClosed color="white" />
            </Button>
          ) : (
            <Button
              title=""
              backgroundColor="transparent"
              onPress={() => setShowPassword(!showPassword)}
              styleCustom={{ paddingVertical: 0, paddingHorizontal: 0 }}
            >
              <EyeIcon color="white" />
            </Button>
          )
        }
        placeholder="Password"
        value={credentials.password}
        secureTextEntry={showPassword}
        onChangeText={(password) =>
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
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#453467",
  },
});
