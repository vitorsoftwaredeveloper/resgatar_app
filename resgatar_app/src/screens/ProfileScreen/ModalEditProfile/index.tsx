import React, { useContext, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { X } from "lucide-react-native";
import {
  formatCEP,
  formatCNPJCPF,
  formatCurrencyBRL,
  formatPhoneNumber,
} from "@/utils/helper";
import { BirthdayPicker } from "@/components/DatePicker";
import { styles } from "./styles";
import { colors } from "@/theme/colors";
import { Input } from "@/components/Input";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/Button";
import { IMemberState } from "@/types/Member";

interface IModalEditProfile {
  editModalVisible: boolean;
  setEditModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalEditProfile = ({
  editModalVisible,
  setEditModalVisible,
}: IModalEditProfile) => {
  const { member, updateMember } = useContext(AuthContext);

  const [memberData, setMemberData] = useState<IMemberState>({
    email: member?.email || "",
    phoneNumber: member?.phoneNumber || "",
    firstName: member?.firstName || "",
    lastName: member?.lastName || "",
    bio: member?.bio || "",
    dateOfBirth: member?.dateOfBirth || 0,
    street: member?.address?.street || "",
    number: member?.address?.number || "",
    city: member?.address?.city || "",
    state: member?.address?.state || "",
    zip: member?.address?.zip || "",
    complement: member?.address?.complement || "",
    datePayment: member?.paymentInfo?.datePayment?.toString() || "",
    amount: formatCurrencyBRL(
      (member?.paymentInfo?.amount?.toString() as string) || "0"
    ),
    type: member?.identification?.type || "CPF",
    numberType: member?.identification?.numberType || "",
  });

  const handleMemberDataChange = (field: string, value: string) => {
    setMemberData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    await updateMember(memberData);
    setEditModalVisible(false);
    Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
  };

  return (
    <Modal
      visible={editModalVisible}
      animationType="slide"
      onRequestClose={() => setEditModalVisible(false)}
      transparent
    >
      <View style={styles.modalContainer}>
        {/* ===== HEADER FIXO ===== */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Editar Perfil</Text>
          <TouchableOpacity onPress={() => setEditModalVisible(false)}>
            <X color={colors.text.primary} size={24} />
          </TouchableOpacity>
        </View>

        {/* ===== CONTEÚDO ===== */}
        <ScrollView
          contentContainerStyle={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ===== DADOS PESSOAIS ===== */}
          <Text style={styles.sectionTitle}>Dados pessoais</Text>
          <View style={styles.section}>
            <Input
              label="Email"
              value={memberData.email}
              onChangeText={(v) => handleMemberDataChange("email", v)}
              keyboardType="email-address"
            />

            <Input
              label="Telefone"
              value={memberData.phoneNumber}
              onChangeText={(v) =>
                handleMemberDataChange("phoneNumber", formatPhoneNumber(v))
              }
              keyboardType="phone-pad"
            />

            <Input
              label="Nome"
              value={memberData.firstName}
              onChangeText={(v) => handleMemberDataChange("firstName", v)}
            />

            <Input
              label="Sobrenome"
              value={memberData.lastName}
              onChangeText={(v) => handleMemberDataChange("lastName", v)}
            />

            <Input
              label="Bio"
              value={memberData.bio}
              onChangeText={(v) => handleMemberDataChange("bio", v)}
              multiline
              numberOfLines={4}
              height={100}
            />

            <View>
              <Text style={styles.label}>Data de nascimento</Text>
              <BirthdayPicker
                date={memberData.dateOfBirth}
                handleDate={(date: any) =>
                  handleMemberDataChange("dateOfBirth", date)
                }
              />
            </View>
          </View>

          {/* ===== ENDEREÇO ===== */}
          <Text style={styles.sectionTitle}>Endereço</Text>
          <View style={styles.section}>
            <Input
              label="CEP"
              value={formatCEP(memberData.zip)}
              onChangeText={(v) => handleMemberDataChange("zip", v)}
              keyboardType="numeric"
            />

            <Input
              label="Estado"
              value={memberData.state}
              autoCapitalize="characters"
              maxLength={2}
              onChangeText={(v) => handleMemberDataChange("state", v)}
            />

            <Input
              label="Cidade"
              value={memberData.city}
              onChangeText={(v) => handleMemberDataChange("city", v)}
            />

            <Input
              label="Logradouro"
              value={memberData.street}
              onChangeText={(v) => handleMemberDataChange("street", v)}
            />

            <Input
              label="Número"
              value={memberData.number}
              onChangeText={(v) => handleMemberDataChange("number", v)}
            />

            <Input
              label="Complemento"
              value={memberData.complement}
              onChangeText={(v) => handleMemberDataChange("complement", v)}
            />
          </View>

          {/* ===== CONTRIBUIÇÃO ===== */}
          <Text style={styles.sectionTitle}>Informações da contribuição</Text>
          <View style={styles.section}>
            <Text style={styles.label}>Dia da contribuição</Text>
            <View style={styles.dayPickerContainer}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayOption,
                    memberData.datePayment === day.toString() &&
                      styles.dayOptionSelected,
                  ]}
                  onPress={() =>
                    handleMemberDataChange("datePayment", day.toString())
                  }
                >
                  <Text
                    style={[
                      styles.dayText,
                      memberData.datePayment === day.toString() &&
                        styles.dayTextSelected,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Input
              label="Valor"
              value={memberData.amount}
              keyboardType="numeric"
              onChangeText={(v) =>
                handleMemberDataChange(
                  "amount",
                  formatCurrencyBRL(v, memberData.amount)
                )
              }
            />
          </View>

          {/* ===== IDENTIFICAÇÃO ===== */}
          <Text style={styles.sectionTitle}>Identificação</Text>
          <View style={styles.section}>
            <View style={styles.pickerContainer}>
              {["CPF", "CNPJ"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.radioOption,
                    memberData.type === type && styles.radioOptionSelected,
                  ]}
                  onPress={() => handleMemberDataChange("type", type)}
                >
                  <Text
                    style={[
                      styles.radioText,
                      memberData.type === type && styles.radioTextSelected,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label={memberData.type}
              value={formatCNPJCPF(memberData.numberType, memberData.type)}
              keyboardType="numeric"
              onChangeText={(v) => handleMemberDataChange("numberType", v)}
            />
          </View>

          {/* ===== AÇÕES ===== */}
          <View style={styles.saveButtonText}>
            <Button
              title="Salvar"
              onPress={handleSaveProfile}
              styleCustom={{ minWidth: "100%" }}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
