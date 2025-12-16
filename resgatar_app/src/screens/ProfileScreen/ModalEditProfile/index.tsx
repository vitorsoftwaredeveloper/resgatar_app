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
import { styles } from "../styles";
import { colors } from "@/theme/colors";
import { Input } from "@/components/Input";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/Button";

interface IModalEditProfile {
  editModalVisible: boolean;
  setEditModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
export const ModalEditProfile = ({
  editModalVisible,
  setEditModalVisible,
}: IModalEditProfile) => {
  //   const [editModalVisible, setEditModalVisible] = useState(false);
  const { member } = useContext(AuthContext);

  const [memberData, setMemberData] = useState({
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

  const handleSaveProfile = () => {
    Alert.alert("Sucesso", "Perfil atualizado!");
    setEditModalVisible(false);
  };

  return (
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
            <X color={colors.white} size={24} />
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
          label="CEP"
          placeholder=""
          value={formatCEP(memberData.zip)}
          onChangeText={(text) => handleMemberDataChange("zip", text)}
          keyboardType="numeric"
        />
        <Input
          label="Estado"
          placeholder=""
          autoCapitalize="characters"
          maxLength={2}
          value={memberData.state}
          onChangeText={(text) => handleMemberDataChange("state", text)}
        />
        <Input
          label="Cidade"
          placeholder=""
          value={memberData.city}
          onChangeText={(text) => handleMemberDataChange("city", text)}
        />
        <Input
          label="Logradouro"
          placeholder=""
          value={memberData.street}
          onChangeText={(text) => handleMemberDataChange("street", text)}
        />
        <Input
          label="Número"
          placeholder=""
          value={memberData.number}
          onChangeText={(text) => handleMemberDataChange("street", text)}
        />
        <Input
          label="Complemento"
          placeholder=""
          value={memberData.complement}
          onChangeText={(text) => handleMemberDataChange("complemento", text)}
        />

        <Text style={styles.sectionTitle}>Informações da contribuição</Text>
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
          placeholder=""
          value={formatCurrencyBRL(memberData.amount)}
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
  );
};
