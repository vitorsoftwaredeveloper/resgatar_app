import React, { useContext, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { X } from "lucide-react-native";
import {
  formatCEP,
  formatCNPJCPF,
  formatCurrencyBRL,
  formatPhoneNumber,
} from "@/utils/helper";
import { styles } from "../styles";
import { Button } from "@/components/Button";
import { AuthContext } from "@/context/AuthContext";

interface IModalUpdatePasswordProps {
  passwordModalVisible: boolean;
  setPasswordModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalUpdatePassword = ({
  passwordModalVisible,
  setPasswordModalVisible,
}: IModalUpdatePasswordProps) => {
  const { changePassword } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "A nova senha e a confirmação não coincidem.");
      return;
    }
    try {
      await changePassword(currentPassword, newPassword);
      Alert.alert("Sucesso", "Senha alterada com sucesso!");
      setPasswordModalVisible(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Alert.alert("Erro", "Falha ao alterar senha. Verifique a senha atual.");
      console.error(error);
    }
  };

  return (
    <Modal
      visible={passwordModalVisible}
      animationType="slide"
      onRequestClose={() => setPasswordModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Alterar Senha</Text>
          <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
            <X color="#FFFFFF" size={24} />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Senha Atual"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Nova Senha"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar Nova Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Button title="Alterar Senha" onPress={handleChangePassword} />
        <Button
          title="Cancelar"
          onPress={() => setPasswordModalVisible(false)}
        />
      </View>
    </Modal>
  );
};
