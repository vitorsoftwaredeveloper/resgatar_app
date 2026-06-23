import React, { useCallback, useEffect, useState } from "react";
import { AppState, Platform, Text, TouchableOpacity, View } from "react-native";
import { ShieldAlert } from "lucide-react-native";
import { isDeveloperModeEnabled } from "@dev-mode-detector";
import { useAppTheme } from "@/context/ThemeContext";
import { IS_PRODUCTION } from "@/config/appEnv";
import { useStyles } from "./styles";

interface Props {
  children: React.ReactNode;
}

// Em PROD no Android, bloqueia o app se "Opções do desenvolvedor"/ADB estiverem
// ativadas. Em HML, local ou iOS não há bloqueio.
const SHOULD_CHECK = IS_PRODUCTION && Platform.OS === "android";

export function DevModeGuard({ children }: Props) {
  const styles = useStyles();
  const { colors } = useAppTheme();
  const [blocked, setBlocked] = useState(false);

  const check = useCallback(() => {
    if (!SHOULD_CHECK) return;
    setBlocked(isDeveloperModeEnabled());
  }, []);

  useEffect(() => {
    check();

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") check();
    });
    return () => sub.remove();
  }, [check]);

  if (!blocked) return <>{children}</>;

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <ShieldAlert size={64} color={colors.error} strokeWidth={1.5} />
      </View>

      <Text style={styles.title}>Modo desenvolvedor ativo</Text>
      <Text style={styles.message}>
        Por segurança, o aplicativo não pode ser usado com as{" "}
        <Text style={styles.bold}>Opções do desenvolvedor</Text> ou a depuração
        USB ativadas neste aparelho.
      </Text>
      <Text style={styles.message}>
        Acesse{" "}
        <Text style={styles.bold}>
          Configurações → Opções do desenvolvedor
        </Text>
        , desative-as e toque em verificar novamente.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={check}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>Verificar novamente</Text>
      </TouchableOpacity>
    </View>
  );
}
