import React, { useContext, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  formatCEP,
  formatCNPJCPF,
  formatCurrencyBRL,
  formatPhoneNumber,
} from "@/utils/helper";
import { BirthdayPicker } from "@/components/DatePicker";
import { styles } from "./styles";
import { Input } from "@/components/Input";
import { AuthContext } from "@/context/AuthContext";
import { IMemberState } from "@/types/Member";
import { Card } from "@/components/Card";
import { Row } from "@/components/Row";
import { Button } from "@/components/Button";
import { ToastMessage } from "@/components/Toast";
import { ModalBase } from "@/components/ModalBase";

interface IModalEditProfile {
  editModalVisible: boolean;
  onClose: () => void;
}

export const ModalEditProfile = ({
  editModalVisible,
  onClose,
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
      (member?.paymentInfo?.amount?.toString() as string) || "0",
    ),
    type: member?.identification?.type || "CPF",
    numberType: member?.identification?.numberType || "",
  });

  const handleMemberDataChange = (field: string, value: string | number) => {
    setMemberData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    await updateMember(memberData)
      .then(() => {
        ToastMessage.success("Sucesso", "Perfil atualizado com sucesso!");
        setTimeout(() => {
          onClose();
        }, 2000);
      })
      .catch(() => {
        ToastMessage.error("Erro", "Falha ao atualizar perfil.");
      });
  };

  return (
    <ModalBase onClose={onClose} visible={editModalVisible} title="Meus dados">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Card title="Dados pessoais">
              <Input
                label="Email"
                value={memberData.email}
                onChangeText={(v: string) => handleMemberDataChange("email", v)}
                keyboardType="email-address"
              />

              <Input
                label="Telefone"
                value={formatPhoneNumber(memberData.phoneNumber)}
                onChangeText={(v: string) =>
                  handleMemberDataChange("phoneNumber", v)
                }
                keyboardType="phone-pad"
              />

              <Input
                label="Nome"
                value={memberData.firstName}
                onChangeText={(v: string) =>
                  handleMemberDataChange("firstName", v)
                }
              />

              <Input
                label="Sobrenome"
                value={memberData.lastName}
                onChangeText={(v: string) =>
                  handleMemberDataChange("lastName", v)
                }
              />

              <Input
                label="Bio"
                value={memberData.bio}
                onChangeText={(v: string) => handleMemberDataChange("bio", v)}
              />
            </Card>

            <Card title="Data de nascimento">
              <BirthdayPicker
                date={memberData.dateOfBirth}
                handleDate={(date) =>
                  handleMemberDataChange("dateOfBirth", date)
                }
              />
            </Card>

            <Card title="Endereço">
              <Input
                label="CEP"
                value={formatCEP(memberData.zip)}
                onChangeText={(v: string) => handleMemberDataChange("zip", v)}
                keyboardType="numeric"
              />
              <Row>
                <Input
                  label="Estado"
                  value={memberData.state}
                  onChangeText={(v: string) =>
                    handleMemberDataChange("state", v)
                  }
                  flex={1}
                  maxLength={2}
                />
                <Input
                  label="Cidade"
                  value={memberData.city}
                  onChangeText={(v: string) =>
                    handleMemberDataChange("city", v)
                  }
                  flex={1}
                />
              </Row>
              <Input
                label="Logradouro"
                value={memberData.street}
                onChangeText={(v: string) =>
                  handleMemberDataChange("street", v)
                }
              />
              <Row>
                <Input
                  label="Número"
                  value={memberData.number}
                  onChangeText={(v: string) =>
                    handleMemberDataChange("number", v)
                  }
                  flex={1}
                  keyboardType="numeric"
                />
                <Input
                  label="Complemento"
                  value={memberData.complement}
                  onChangeText={(v: string) =>
                    handleMemberDataChange("complement", v)
                  }
                  flex={1}
                />
              </Row>
            </Card>

            <Card title="Informações da contribuição">
              <Text style={styles.subLabel}>Dia da contribuição</Text>

              <View style={styles.daysGrid}>
                {Array.from({ length: 10 }, (_, i) => {
                  const day = i + 1;
                  const selected =
                    day === parseInt(memberData.datePayment || "1");

                  return (
                    <TouchableOpacity
                      key={day}
                      onPress={() =>
                        handleMemberDataChange("datePayment", day.toString())
                      }
                      style={[
                        styles.dayCircle,
                        selected && styles.dayCircleActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          selected && styles.dayTextActive,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Input
                label="Valor"
                value={memberData.amount}
                onChangeText={(v: string) =>
                  handleMemberDataChange("amount", formatCurrencyBRL(v))
                }
                keyboardType="decimal-pad"
              />
            </Card>

            <Card title="Identificação">
              <View style={styles.toggle}>
                <TouchableOpacity
                  onPress={() => handleMemberDataChange("type", "CPF")}
                  style={[
                    styles.toggleItem,
                    memberData.type === "CPF" && styles.toggleActive,
                  ]}
                >
                  <Text
                    style={
                      memberData.type === "CPF"
                        ? styles.toggleTextActive
                        : styles.toggleText
                    }
                  >
                    CPF
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleMemberDataChange("type", "CNPJ")}
                  style={[
                    styles.toggleItem,
                    memberData.type === "CNPJ" && styles.toggleActive,
                  ]}
                >
                  <Text
                    style={
                      memberData.type === "CNPJ"
                        ? styles.toggleTextActive
                        : styles.toggleText
                    }
                  >
                    CNPJ
                  </Text>
                </TouchableOpacity>
              </View>

              <Input
                label={memberData.type}
                value={formatCNPJCPF(memberData.numberType, memberData.type)}
                onChangeText={(v: string) =>
                  handleMemberDataChange("numberType", v)
                }
                keyboardType="numeric"
              />
            </Card>
          </ScrollView>

          <View style={styles.footer}>
            <Button title="Salvar" onPress={handleSaveProfile} />
          </View>
        </View>
      </View>
    </ModalBase>
  );
};
