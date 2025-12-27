import React, { useContext, useState } from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { AuthContext } from "@/context/AuthContext";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { LoadingContext } from "@/context/LoadingContext";
import { Eye, EyeOff, LogIn, Mail } from "lucide-react-native";
import { styles } from "./styles";
import { COLORS } from "@/theme";
import { ToastMessage } from "@/components/Toast";

export const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const { loading } = useContext(LoadingContext);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!credentials.email || !credentials.password) {
      ToastMessage.error("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      await login(credentials.email.trim(), credentials.password);
    } catch (error: any) {
      ToastMessage.error("Erro", "Usuário ou senha incorretos.");
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.card}>
        <Text style={styles.title}>Comunidade Resgatar</Text>
        <Text style={styles.subtitle}>Mc 10, 45</Text>

        <Input
          placeholder="Email"
          value={credentials.email}
          onChangeText={(v: string) =>
            setCredentials((p) => ({ ...p, email: v }))
          }
          keyboardType="email-address"
          autoCapitalize="none"
          rightIcon={<Mail size={24} color={COLORS.muted} />}
        />

        <Input
          placeholder="Senha"
          value={credentials.password}
          secureTextEntry={!showPassword}
          onChangeText={(v: string) =>
            setCredentials((p) => ({ ...p, password: v }))
          }
          rightIcon={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <Eye size={24} color={COLORS.muted} />
              ) : (
                <EyeOff size={24} color={COLORS.muted} />
              )}
            </TouchableOpacity>
          }
        />

        <Button
          title={"Entrar"}
          onPress={handleLogin}
          disabled={loading}
          styleCustom={styles.submitButton}
          leftIcon={<LogIn size={20} color="#FFF" />}
        />

        <View style={styles.footer}>
          <View style={styles.divider} />
          <Text style={styles.footerText}>
            Doar a vida por amor a santa cruz!
          </Text>
          <View style={styles.divider} />
        </View>
      </View>
    </View>
  );
};
