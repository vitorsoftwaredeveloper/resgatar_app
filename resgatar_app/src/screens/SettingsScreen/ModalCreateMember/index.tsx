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
import { IconButton } from "@/components/IconButton";
import { Eye, EyeOff, X } from "lucide-react-native";
import { COLORS } from "@/theme";
import { Button } from "@/components/Button";
import { ToastMessage } from "@/components/Toast";
import { ModalBase } from "@/components/ModalBase";

interface IModalEditProfile {
  createMemberModal: boolean;
  onClose: () => void;
}

export const ModalCreateMember = ({
  createMemberModal,
  onClose,
}: IModalEditProfile) => {
  const { createMember } = useContext(AuthContext);

  const [memberData, setMemberData] = useState<
    IMemberState & { password: string }
  >({
    amount: "0",
    bio: "",
    city: "",
    complement: "",
    dateOfBirth: 0,
    datePayment: "",
    email: "",
    firstName: "",
    lastName: "",
    number: "",
    numberType: "",
    phoneNumber: "",
    state: "",
    street: "",
    type: "CPF",
    zip: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleMemberDataChange = (field: string, value: string | number) => {
    setMemberData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    await createMember(memberData)
      .then(() => {
        ToastMessage.success("Sucesso", "Usuário criado com sucesso!");
        onClose();
      })
      .catch(() => {
        ToastMessage.error("Erro", "Falha ao criar novo usuário.");
      });
  };

  return (
    <ModalBase onClose={onClose} visible={createMemberModal}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Novo usuário</Text>

            <IconButton color={COLORS.white} icon={X} onPress={onClose} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* DADOS PESSOAIS */}
            <Card title="Dados pessoais">
              <Input
                label="Email"
                value={memberData.email}
                onChangeText={(v: string) => handleMemberDataChange("email", v)}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Password"
                value={memberData.password}
                onChangeText={(v: string) =>
                  handleMemberDataChange("password", v)
                }
                keyboardType="default"
                secureTextEntry={!showPassword}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
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

            {/* DATA NASCIMENTO */}
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
                  maxLength={2}
                  autoCapitalize="characters"
                />

                <Input
                  label="Cidade"
                  value={memberData.city}
                  onChangeText={(v: string) =>
                    handleMemberDataChange("city", v)
                  }
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
                  keyboardType="numeric"
                />
                <Input
                  label="Complemento"
                  value={memberData.complement}
                  onChangeText={(v: string) =>
                    handleMemberDataChange("complement", v)
                  }
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
