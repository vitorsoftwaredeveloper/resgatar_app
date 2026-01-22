import React, { useContext, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { Input } from "@/components/Input";
import { AuthContext } from "@/context/AuthContext";
import { IMemberState } from "@/types/Member";
import { Card } from "@/components/Card";
import { Row } from "@/components/Row";
import { Eye, EyeOff } from "lucide-react-native";
import { COLORS } from "@/theme";
import { Button } from "@/components/Button";
import { ToastMessage } from "@/components/Toast";
import { ModalBase } from "@/components/ModalBase";
import {
  maskCEP,
  maskCPFOrCNPJ,
  maskCurrencyBRL,
  maskDateBR,
  maskPhoneBR,
  onlyNumbers,
} from "@/utils/mask";
import { parseDateBRToTimestamp } from "@/utils/helper";
import { Formik } from "formik";
import * as Yup from "yup";

interface IModalEditProfile {
  createMemberModal: boolean;
  onClose: () => void;
}

const createMemberSchema = Yup.object().shape({
  email: Yup.string().email("Email inválido").required("Email obrigatório"),
  firstName: Yup.string().required("Nome obrigatório"),
  lastName: Yup.string().required("Sobrenome obrigatório"),
  phoneNumber: Yup.string()
    .test(
      "phone",
      "Telefone inválido",
      (v) => onlyNumbers(v || "").length >= 10,
    )
    .required("Telefone obrigatório"),

  zip: Yup.string().test(
    "cep",
    "CEP inválido",
    (v) => onlyNumbers(v || "").length === 8,
  ),

  state: Yup.string().length(2, "UF inválida"),
  city: Yup.string(),
  street: Yup.string(),
  number: Yup.string(),

  dateOfBirth: Yup.string()
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Data inválida")
    .required("Data de nascimento obrigatória"),

  datePayment: Yup.string().required("Selecione o dia"),

  amount: Yup.string()
    .test(
      "amount",
      "Valor deve ser maior que zero",
      (v) => Number(onlyNumbers(v || "")) > 0,
    )
    .required("Valor obrigatório"),

  type: Yup.string().oneOf(["CPF", "CNPJ"]).required(),

  numberType: Yup.string()
    .test("doc", "Documento inválido", (value, ctx) => {
      const type = ctx.parent.type;
      const digits = onlyNumbers(value || "");
      return type === "CPF" ? digits.length === 11 : digits.length === 14;
    })
    .required("Documento obrigatório"),

  password: Yup.string()
    .required("Senha é obrigatória")
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .matches(/^(?=.*[a-z])/, "Deve conter letra minúscula")
    .matches(/^(?=.*[A-Z])/, "Deve conter letra maiúscula")
    .matches(/^(?=.*\d)/, "Deve conter número")
    .matches(/^(?=.*[@$!%*?&#])/, "Deve conter caractere especial @$!%*?&#"),

  confirmPassword: Yup.string()
    .required("Confirmação de senha é obrigatória")
    .oneOf([Yup.ref("password")], "As senhas não conferem"),
});

export const ModalCreateMember = ({
  createMemberModal,
  onClose,
}: IModalEditProfile) => {
  const { createMember } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    bio: "",
    dateOfBirth: "",
    street: "",
    number: "",
    city: "",
    state: "",
    zip: "",
    complement: "",
    datePayment: "1",
    amount: "R$ 0,00",
    type: "CPF",
    numberType: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmitForm = async (values: typeof initialValues) => {
    const payload: IMemberState & { password: string } = {
      ...values,
      type: values.type as "CPF" | "CNPJ",
      phoneNumber: onlyNumbers(values.phoneNumber),
      zip: onlyNumbers(values.zip),
      numberType: onlyNumbers(values.numberType),
      dateOfBirth: parseDateBRToTimestamp(values.dateOfBirth),
    };

    try {
      await createMember(payload);
      ToastMessage.success("Sucesso", "Usuário criado com sucesso!");
      setTimeout(onClose, 2000);
    } catch {
      ToastMessage.error("Erro", "Falha ao criar novo membro.");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={createMemberSchema}
      onSubmit={handleSubmitForm}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        setFieldValue,
        handleSubmit,
        isSubmitting,
      }) => (
        <ModalBase
          visible={createMemberModal}
          onClose={onClose}
          title="Novo membro"
        >
          <View style={styles.overlay}>
            <View style={styles.container}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* DADOS PESSOAIS */}
                <Card title="Dados pessoais">
                  <Input
                    label="Email"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    error={touched.email && errors.email}
                    autoCapitalize="none"
                  />

                  <Input
                    label="Telefone"
                    value={values.phoneNumber}
                    keyboardType="numeric"
                    onChangeText={(v) =>
                      setFieldValue("phoneNumber", maskPhoneBR(v))
                    }
                    error={touched.phoneNumber && errors.phoneNumber}
                  />

                  <Input
                    label="Nome"
                    value={values.firstName}
                    onChangeText={handleChange("firstName")}
                    error={touched.firstName && errors.firstName}
                  />

                  <Input
                    label="Sobrenome"
                    value={values.lastName}
                    onChangeText={handleChange("lastName")}
                    error={touched.lastName && errors.lastName}
                  />

                  <Input
                    label="Bio"
                    value={values.bio}
                    onChangeText={handleChange("bio")}
                  />
                </Card>

                {/* SEGURANÇA */}
                <Card title="Segurança">
                  <Input
                    label="Senha"
                    secureTextEntry={!showPassword}
                    value={values.password}
                    onChangeText={handleChange("password")}
                    error={touched.password && errors.password}
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
                    label="Confirmar senha"
                    secureTextEntry={!showPassword}
                    value={values.confirmPassword}
                    onChangeText={handleChange("confirmPassword")}
                    error={touched.confirmPassword && errors.confirmPassword}
                  />
                </Card>

                {/* DATA NASCIMENTO */}
                <Card title="Data de nascimento">
                  <Input
                    label="Data de nascimento"
                    placeholder="dd/mm/aaaa"
                    value={values.dateOfBirth}
                    onChangeText={(v) =>
                      setFieldValue("dateOfBirth", maskDateBR(v))
                    }
                    keyboardType="numeric"
                    error={touched.dateOfBirth && errors.dateOfBirth}
                  />
                </Card>

                {/* ENDEREÇO */}
                <Card title="Endereço">
                  <Input
                    label="CEP"
                    value={values.zip}
                    keyboardType="numeric"
                    onChangeText={(v) => setFieldValue("zip", maskCEP(v))}
                    error={touched.zip && errors.zip}
                  />

                  <Row>
                    <Input
                      label="Estado"
                      value={values.state}
                      autoCapitalize="characters"
                      maxLength={2}
                      onChangeText={handleChange("state")}
                      error={touched.state && errors.state}
                    />

                    <Input
                      label="Cidade"
                      value={values.city}
                      onChangeText={handleChange("city")}
                      error={touched.city && errors.city}
                    />
                  </Row>

                  <Input
                    label="Logradouro"
                    value={values.street}
                    onChangeText={handleChange("street")}
                    error={touched.street && errors.street}
                  />

                  <Row>
                    <Input
                      label="Número"
                      keyboardType="numeric"
                      value={values.number}
                      onChangeText={handleChange("number")}
                      error={touched.number && errors.number}
                    />

                    <Input
                      label="Complemento"
                      value={values.complement}
                      onChangeText={handleChange("complement")}
                    />
                  </Row>
                </Card>

                {/* CONTRIBUIÇÃO */}
                <Card title="Informações da contribuição">
                  <Text style={styles.subLabel}>
                    Dia do mês para pagar a contribuição
                  </Text>

                  <View style={styles.daysGrid}>
                    {Array.from({ length: 10 }, (_, i) => {
                      const day = String(i + 1);
                      return (
                        <TouchableOpacity
                          key={day}
                          onPress={() => setFieldValue("datePayment", day)}
                          style={[
                            styles.dayCircle,
                            values.datePayment === day &&
                              styles.dayCircleActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.dayText,
                              values.datePayment === day &&
                                styles.dayTextActive,
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
                    value={values.amount}
                    keyboardType="numeric"
                    onChangeText={(v) =>
                      setFieldValue("amount", maskCurrencyBRL(v))
                    }
                    error={touched.amount && errors.amount}
                  />
                </Card>

                {/* IDENTIFICAÇÃO */}
                <Card title="Identificação">
                  <View style={styles.toggle}>
                    {["CPF", "CNPJ"].map((type) => (
                      <TouchableOpacity
                        key={type}
                        onPress={() => setFieldValue("type", type)}
                        style={[
                          styles.toggleItem,
                          values.type === type && styles.toggleActive,
                        ]}
                      >
                        <Text
                          style={
                            values.type === type
                              ? styles.toggleTextActive
                              : styles.toggleText
                          }
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Input
                    label={values.type}
                    value={values.numberType}
                    keyboardType="numeric"
                    onChangeText={(v) =>
                      setFieldValue(
                        "numberType",
                        maskCPFOrCNPJ(v, values.type as "CPF" | "CNPJ"),
                      )
                    }
                    error={touched.numberType && errors.numberType}
                  />
                </Card>
              </ScrollView>

              <View style={styles.footer}>
                <Button
                  title="Salvar"
                  onPress={handleSubmit as any}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                />
              </View>
            </View>
          </View>
        </ModalBase>
      )}
    </Formik>
  );
};
