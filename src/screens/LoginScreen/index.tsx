import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { LogoResgatar } from "@/components/Svg/Logo";
import { ToastMessage } from "@/components/Toast";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { RootStackParamList } from "@/navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Eye, EyeOff, LogIn, Mail } from "lucide-react-native";
import React, { useContext, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useStyles } from "../../../src/screens/LoginScreen/styles";

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen = ({ navigation }: Props) => {
  const { login } = useContext(AuthContext);
  const styles = useStyles();
  const { colors } = useAppTheme();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef<string>("");
  const passwordRef = useRef<string>("");

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleLogin = async () => {
    setLoading(true);

    if (!emailRef.current || !passwordRef.current) {
      ToastMessage.error("Erro", "Preencha todos os campos.");
      setLoading(false);
      return;
    }

    if (!isValidEmail(emailRef.current)) {
      ToastMessage.error("Erro", "Informe um e-mail válido.");
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
              <TouchableOpacity
                testID="toggle-password"
                accessibilityLabel="toggle-password"
                onPress={() => setShowPassword(!showPassword)}
              >
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

        <View style={{ marginTop: 16, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: colors.textMuted, fontSize: 14 }}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{ color: colors.primary, fontSize: 14, fontWeight: "600" }}>Registre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
