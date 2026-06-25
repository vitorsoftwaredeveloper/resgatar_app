import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { ModalBase } from "@/components/ModalBase";
import { ToastMessage } from "@/components/Toast";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { AlertTriangle, Eye, EyeOff, Lock } from "lucide-react-native";
import React, { useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useStyles } from "./styles";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const WARNINGS = [
  "Todos os seus dados pessoais serão removidos permanentemente.",
  "Seu histórico de contribuições será excluído.",
  "O acesso ao aplicativo será encerrado imediatamente.",
  "Esta ação não pode ser desfeita.",
];

export function ModalDeleteAccount({ visible, onClose }: Props) {
  const { deleteAccount } = useContext(AuthContext);
  const { colors } = useAppTheme();
  const styles = useStyles();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!password.trim()) {
      ToastMessage.error(
        "Campo obrigatório",
        "Informe sua senha para continuar.",
      );
      return;
    }
    setLoading(true);
    try {
      await deleteAccount(password);
      ToastMessage.success("Conta encerrada", "Sua conta foi encerrada com sucesso.");
    } catch (error: any) {
      const isWrongPassword =
        error?.name === "NotAuthorizedException" ||
        error?.message === "Senha incorreta.";
      ToastMessage.error(
        "Erro",
        isWrongPassword
          ? "Senha incorreta. Verifique e tente novamente."
          : "Não foi possível encerrar a conta. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalBase visible={visible} onClose={onClose} title="Encerrar conta">
      <View style={styles.overlay}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <View style={styles.container}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Card title="Atenção">
                <View style={styles.warningHeader}>
                  <AlertTriangle size={20} color={colors.error} />
                  <Text style={styles.warningTitle}>
                    Ao encerrar sua conta, os seguintes dados serão removidos:
                  </Text>
                </View>

                {WARNINGS.map((text, i) => (
                  <View key={i} style={styles.warningItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.warningText}>{text}</Text>
                  </View>
                ))}
              </Card>

              <Card title="Confirmar identidade">
                <Text style={styles.confirmLabel}>
                  Para confirmar o encerramento, informe sua senha de acesso:
                </Text>

                <Input
                  label="Senha"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  rightIcon={
                    <TouchableOpacity
                      onPress={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? (
                        <Eye size={20} color={colors.muted} />
                      ) : (
                        <EyeOff size={20} color={colors.muted} />
                      )}
                    </TouchableOpacity>
                  }
                  leftIcon={<Lock size={20} color={colors.muted} />}
                />
              </Card>
            </ScrollView>

            <View style={styles.footer}>
              <Button
                title="Encerrar conta"
                onPress={handleDelete}
                loading={loading}
                disabled={loading}
                styleCustom={styles.deleteButton}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ModalBase>
  );
}
