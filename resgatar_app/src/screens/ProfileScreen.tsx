import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { X } from "lucide-react-native";
import { colors } from "../theme/colors";
import { AuthContext } from "../context/AuthContext";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { formatCNPJCPF, formatPhoneNumber } from "@/utils/helper";

export const ProfileScreen = () => {
  const { logout, member } = useContext(AuthContext);

  const [memberData, setMemberData] = useState({
    email: member?.email || "",
    phoneNumber: member?.phoneNumber || "",
    firstName: member?.firstName || "",
    lastName: member?.lastName || "",
    bio: member?.bio || "",
    age: member?.age?.toString() || "",
    street: member?.address?.street || "",
    number: member?.address?.number || "",
    city: member?.address?.city || "",
    state: member?.address?.state || "",
    zip: member?.address?.zip || "",
    datePayment: member?.paymentInfo?.datePayment?.toString() || "",
    amount: member?.paymentInfo?.amount?.toString() || "",
    type: member?.identification?.type || "CPF",
    numberType: member?.identification?.number || "",
  });

  const handleMemberDataChange = (field: string, value: string) => {
    setMemberData({
      ...memberData,
      [field]: value,
    });
  };

  const handleSave = () => {
    // TODO: Save to API
    Alert.alert("Sucesso", "Perfil atualizado!");
  };

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveProfile = () => {
    Alert.alert("Sucesso", "Perfil atualizado!");
    setEditModalVisible(false);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }
    Alert.alert("Sucesso", "Senha alterada!");
    setPasswordModalVisible(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <TouchableOpacity
        style={styles.option}
        onPress={() => setEditModalVisible(true)}
      >
        <Text style={styles.optionText}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => setPasswordModalVisible(true)}
      >
        <Text style={styles.optionText}>Alterar Senha</Text>
      </TouchableOpacity>

      <Button title="Sair" onPress={logout} />

      <Modal
        visible={editModalVisible}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
        transparent
      >
        <ScrollView
          style={styles.modalContainer}
          contentContainerStyle={{
            gap: 12,
          }}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <X color="#FFFFFF" size={24} />
            </TouchableOpacity>
          </View>

          <Input
            label="Email"
            placeholder=""
            value={memberData.email}
            onChangeText={(email) => handleMemberDataChange("email", email)}
            keyboardType="email-address"
          />

          <Input
            label="Telefone"
            placeholder=""
            value={memberData.phoneNumber}
            onChangeText={(text) =>
              handleMemberDataChange("phoneNumber", formatPhoneNumber(text))
            }
            keyboardType="phone-pad"
          />

          <Input
            label="Nome"
            placeholder=""
            value={memberData.firstName}
            onChangeText={(text) => handleMemberDataChange("firstName", text)}
          />

          <Input
            label="Sobrenome"
            placeholder=""
            value={memberData.lastName}
            onChangeText={(text) => handleMemberDataChange("lastName", text)}
          />

          <Input
            label="Bio"
            placeholder=""
            value={memberData.bio}
            onChangeText={(text) => handleMemberDataChange("bio", text)}
            multiline
            numberOfLines={4}
            height={100}
          />

          <Text style={styles.label}>Data de nascimento</Text>
          <BirthdayPicker
            date={memberData.dateOfBirth}
            handleDate={(date: any) =>
              handleMemberDataChange("dateOfBirth", date)
            }
          />

          <Text style={styles.sectionTitle}>Endereço</Text>
          <Input
            label="Rua"
            placeholder=""
            value={memberData.street}
            onChangeText={(text) => handleMemberDataChange("street", text)}
          />
          <Input
            label="Número"
            placeholder=""
            value={memberData.number}
            onChangeText={(text) => handleMemberDataChange("number", text)}
          />
          <Input
            label="Cidade"
            placeholder=""
            value={memberData.city}
            onChangeText={(text) => handleMemberDataChange("city", text)}
          />
          <Input
            label="Estado"
            placeholder=""
            value={memberData.state}
            onChangeText={(text) => handleMemberDataChange("state", text)}
          />
          <Input
            label="CEP"
            placeholder=""
            value={memberData.zip}
            onChangeText={(text) => handleMemberDataChange("zip", text)}
          />

          <Text style={styles.sectionTitle}>Informações de Pagamento</Text>
          <Input
            label="Data de Pagamento"
            placeholder=""
            value={memberData.datePayment}
            onChangeText={(text) => handleMemberDataChange("datePayment", text)}
            keyboardType="numeric"
          />
          <Input
            label="Valor"
            placeholder=""
            value={memberData.amount}
            onChangeText={(text) => handleMemberDataChange("amount", text)}
            keyboardType="numeric"
          />

          <Text style={styles.sectionTitle}>Identificação</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={[
                styles.radioOption,
                memberData.type === "CPF" && styles.radioOptionSelected,
              ]}
              onPress={() => handleMemberDataChange("type", "CPF")}
            >
              <Text
                style={[
                  styles.radioText,
                  memberData.type === "CPF" && styles.radioTextSelected,
                ]}
              >
                CPF
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioOption,
                memberData.type === "CNPJ" && styles.radioOptionSelected,
              ]}
              onPress={() => handleMemberDataChange("type", "CNPJ")}
            >
              <Text
                style={[
                  styles.radioText,
                  memberData.type === "CNPJ" && styles.radioTextSelected,
                ]}
              >
                CNPJ
              </Text>
            </TouchableOpacity>
          </View>
          <Input
            label={memberData.type}
            placeholder=""
            value={formatCNPJCPF(memberData.numberType, memberData.type)}
            onChangeText={(text) => handleMemberDataChange("numberType", text)}
            keyboardType="numeric"
          />

          <Button title="Salvar" onPress={handleSaveProfile} />
          <Button title="Cancelar" onPress={() => setEditModalVisible(false)} />
        </ScrollView>
      </Modal>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  option: {
    backgroundColor: colors.lightGray,
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  optionText: {
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.modalBackground,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.text,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: colors.text,
  },
  pickerContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  radioOption: {
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginRight: 10,
    backgroundColor: colors.background,
  },
  radioOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  radioText: {
    fontSize: 16,
    color: colors.text,
  },
  radioTextSelected: {
    color: colors.white,
  },
  input: {
    height: 52,
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 20,
    color: colors.text,
  },
});
