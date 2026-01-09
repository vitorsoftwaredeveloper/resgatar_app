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
}

export const ModalUpdatePassword = ({
  passwordModalVisible,
  onClose,
}: IModalUpdatePassword) => {
  const { changePassword } = useContext(AuthContext);
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState<{
    password: boolean;
    confirmPassword: boolean;
  }>({
    password: false,
    confirmPassword: false,
  });

  const handlePasswordDataChange = (field: string, value: string | number) => {
    setPasswordData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleShowPassword = (field: string) => {
    setShowPassword((prevData: any) => ({
      ...prevData,
      [field]: !prevData[field],
    }));
  };

  const handleSavePassword = async () => {
    if (passwordData.password !== passwordData.confirmPassword) {
      ToastMessage.error("Erro", "Senhas diferentes");
      return;
    }

    await changePassword(passwordData.password)
      .then(() => {
        ToastMessage.success("Senha alterada com sucesso");
        onClose();
      })
      .catch(() => {
        ToastMessage.error("Erro ao alterar senha");
      });
  };

  return (
    <ModalBase visible={passwordModalVisible} onClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Minha senha</Text>

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
                secureTextEntry={!showPassword.password}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => handleShowPassword("password")}
                  >
                    {showPassword.password ? (
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
                secureTextEntry={!showPassword.confirmPassword}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => handleShowPassword("confirmPassword")}
                  >
                    {showPassword.confirmPassword ? (
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
