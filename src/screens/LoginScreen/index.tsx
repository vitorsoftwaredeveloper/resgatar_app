import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { LogoResgatar } from "@/components/Svg/Logo";
import { ToastMessage } from "@/components/Toast";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { Eye, EyeOff, LogIn, Mail } from "lucide-react-native";
import React, { useContext, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useStyles } from "../../../src/screens/LoginScreen/styles";

export const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const styles = useStyles();
  const { colors } = useAppTheme();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef<string>("");
  const passwordRef = useRef<string>("");

  const handleLogin = async () => {
    setLoading(true);
    if (!emailRef.current || !passwordRef.current) {
      ToastMessage.error("Erro", "Preencha todos os campos.");
      setLoading(false);
      return;
    }

    try {
      await login(emailRef.current.trim(), passwordRef.current);
    } catch (error: any) {
      ToastMessage.error("Erro", "Usuário ou senha incorretos.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.background}>
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <LogoResgatar color={colors.primary} size={300} />
        </View>

        <Text style={styles.title}>Comunidade Resgatar</Text>

        <View style={styles.motion}>
          <View style={styles.divider} />
          <Text style={styles.motionText}>
            Doar a vida por amor a santa cruz!
          </Text>
          <View style={styles.divider} />
        </View>

        <Text style={styles.subtitle}>Mc 10, 45</Text>

        <View style={styles.form}>
          <Input
            placeholder="Email"
            onChangeText={(v: string) => {
              emailRef.current = v;
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            rightIcon={<Mail size={24} color={colors.muted} />}
          />

          <Input
            placeholder="Senha"
            secureTextEntry={!showPassword}
            onChangeText={(v: string) => {
              passwordRef.current = v;
            }}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <Eye size={24} color={colors.muted} />
                ) : (
                  <EyeOff size={24} color={colors.muted} />
                )}
              </TouchableOpacity>
            }
          />
        </View>

        <Button
          title={"Entrar"}
          onPress={handleLogin}
          styleCustom={styles.submitButton}
          leftIcon={<LogIn size={20} color={colors.background} />}
          loading={loading}
        />
      </View>
    </View>
  );
};
