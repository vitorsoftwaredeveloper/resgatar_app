import React, { useContext, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { Input } from "@/components/Input";
import { AuthContext } from "@/context/AuthContext";
import { Card } from "@/components/Card";
import { IconButton } from "@/components/IconButton";
import { Eye, EyeOff, X } from "lucide-react-native";
import { COLORS } from "@/theme";
import { Button } from "@/components/Button";
import { ToastMessage } from "@/components/Toast";
import { ModalBase } from "@/components/ModalBase";

interface IModalUpdatePassword {
  passwordModalVisible: boolean;
  onClose: () => void;
  memberIdPasswordWillBeChanged?: string;
}

export const ModalUpdatePassword = ({
  passwordModalVisible,
  onClose,
  memberIdPasswordWillBeChanged,
}: IModalUpdatePassword) => {
  const { changePassword, member } = useContext(AuthContext);
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordDataChange = (field: string, value: string | number) => {
    setPasswordData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSavePassword = async () => {
    if (passwordData.password !== passwordData.confirmPassword) {
      ToastMessage.error("Erro", "Senhas diferentes");
      return;
    }

    await changePassword(
      memberIdPasswordWillBeChanged
        ? memberIdPasswordWillBeChanged
        : (member?._id as string),
      passwordData.password
    )
      .then(() => {
        ToastMessage.success("Senha alterada com sucesso");
        setTimeout(() => {
          onClose();
        }, 2000);
      })
      .catch(() => {
        ToastMessage.error("Erro ao atualizar senha");
      });
  };

  return (
    <ModalBase visible={passwordModalVisible} onClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Atualizar senha</Text>

            <IconButton color={COLORS.white} icon={X} onPress={onClose} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Card title="Senha">
              <Input
                label="Nova senha"
                value={passwordData.password}
                onChangeText={(v: string) =>
                  handlePasswordDataChange("password", v)
                }
                keyboardType="default"
                secureTextEntry={!showPassword}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <Eye size={24} color={COLORS.muted} />
                    ) : (
                      <EyeOff size={24} color={COLORS.muted} />
                    )}
                  </TouchableOpacity>
                }
              />

              <Input
                label="Confirmar senha"
                value={passwordData.confirmPassword}
                onChangeText={(v: string) =>
                  handlePasswordDataChange("confirmPassword", v)
                }
                keyboardType="default"
                secureTextEntry={!showPassword}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <Eye size={24} color={COLORS.muted} />
                    ) : (
                      <EyeOff size={24} color={COLORS.muted} />
                    )}
                  </TouchableOpacity>
                }
              />
            </Card>
          </ScrollView>

          <View style={styles.footer}>
            <Button title="Salvar" onPress={handleSavePassword} />
          </View>
        </View>
      </View>
    </ModalBase>
  );
};
