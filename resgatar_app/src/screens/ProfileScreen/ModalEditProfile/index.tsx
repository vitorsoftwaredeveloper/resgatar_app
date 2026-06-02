import React, { useContext, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { styles } from "./styles";
import { Input } from "@/components/Input";
import { AuthContext } from "@/context/AuthContext";
import { IMemberState } from "@/types/Member";
import { Card } from "@/components/Card";
import { Row } from "@/components/Row";
import { Button } from "@/components/Button";
import { ToastMessage } from "@/components/Toast";
import { ModalBase } from "@/components/ModalBase";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  maskCEP,
  maskCPFOrCNPJ,
  maskCurrencyBRL,
  maskDateBR,
  maskPhoneBR,
  onlyNumbers,
  validateCPF,
  validateCNPJ,
} from "@/utils/mask";
import { useMaskedFieldFromFormik } from "@/hooks/useMaskedField";
import {
  formatDateFromTimestamp,
  parseDateBRToTimestamp,
} from "@/utils/helper";

interface IModalEditProfile {
  editModalVisible: boolean;
  onClose: () => void;
}

const profileValidationSchema = Yup.object().shape({
  email: Yup.string().email("Email inválido").required("Email obrigatório"),

  firstName: Yup.string().required("Nome obrigatório"),

  lastName: Yup.string().required("Sobrenome obrigatório"),

  bio: Yup.string().max(300, "Máximo de 300 caracteres"),

  dateOfBirth: Yup.string()
    .required("Data de nascimento obrigatória")
    .test("valid-date", "Data inválida", (value?: string) => {
      if (!value || value.length !== 10) return false;

      const [day, month, year] = value.split("/").map(Number);
      const date = new Date(year, month - 1, day);

      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    }),

  state: Yup.string().length(2, "UF inválida"),

  city: Yup.string(),

  street: Yup.string(),

  number: Yup.string(),

  complement: Yup.string().nullable(),

  datePayment: Yup.string().required("Selecione o dia"),

  type: Yup.string().oneOf(["CPF", "CNPJ"]).required(),

  phoneNumber: Yup.string()
    .test(
      "phone",
      "Telefone inválido",
      (value) => onlyNumbers(value || "").length >= 10,
    )
    .required("Telefone obrigatório"),

  zip: Yup.string()
    .test(
      "cep",
      "CEP inválido",
      (value) => onlyNumbers(value || "").length === 8,
    )
    .required("CEP obrigatório"),

  amount: Yup.string()
    .test(
      "amount",
      "Informe um valor de contribuição válido (mínimo R$ 1,00)",
      (value) => Number(onlyNumbers(value || "")) >= 100,
    )
    .required("Valor obrigatório"),

  numberType: Yup.string()
    .test("doc", "Documento inválido", (value, ctx) => {
      const type = ctx.parent.type;
      return type === "CPF"
        ? validateCPF(value || "")
        : validateCNPJ(value || "");
    })
    .required("Documento obrigatório"),
});

export const ModalEditProfile = ({
  editModalVisible,
  onClose,
}: IModalEditProfile) => {
  const { member, updateMember } = useContext(AuthContext);
  const savedDocValues = useRef<Record<string, string>>({
    CPF: maskCPFOrCNPJ(member?.identification?.numberType || "", "CPF"),
    CNPJ: "",
  });

  const initialValues: IMemberState = {
    email: member?.email || "",
    phoneNumber: maskPhoneBR(member?.phoneNumber || ""),
    firstName: member?.firstName || "",
    lastName: member?.lastName || "",
    bio: member?.bio || "",
    dateOfBirth: formatDateFromTimestamp(Number(member?.dateOfBirth)) || "",
    street: member?.address?.street || "",
    number: member?.address?.number || "",
    city: member?.address?.city || "",
    state: member?.address?.state || "",
    zip: maskCEP(member?.address?.zip || ""),
    complement: member?.address?.complement || "",
    datePayment: member?.paymentInfo?.datePayment?.toString() || "",
    amount: member?.paymentInfo?.amount
      ? maskCurrencyBRL(member.paymentInfo.amount)
      : "",
    type: member?.identification?.type || "CPF",
    numberType: maskCPFOrCNPJ(
      member?.identification?.numberType || "",
      member?.identification?.type || "CPF",
    ),
  };

  const handleSaveProfile = async (
    values: IMemberState,
    { setSubmitting }: any,
  ) => {
    const payload = {
      ...values,
      phoneNumber: onlyNumbers(values.phoneNumber as string),
      zip: onlyNumbers(values.zip as string),
      numberType: onlyNumbers(values.numberType as string),
      dateOfBirth: parseDateBRToTimestamp(values.dateOfBirth as string),
    };

    try {
      await updateMember(payload);
      onClose();
      ToastMessage.success("Sucesso", "Perfil atualizado com sucesso!");
    } catch {
      ToastMessage.error("Erro", "Falha ao atualizar perfil.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={profileValidationSchema}
      onSubmit={handleSaveProfile}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue,
        validateForm,
        isSubmitting,
        dirty,
      }) => {
        const phoneField = useMaskedFieldFromFormik(
          "phoneNumber",
          maskPhoneBR,
          { values, setFieldValue },
        );
        const cepField = useMaskedFieldFromFormik("zip", maskCEP, {
          values,
          setFieldValue,
        });

        const amountField = useMaskedFieldFromFormik(
          "amount",
          maskCurrencyBRL,
          { values, setFieldValue },
        );

        const documentField = useMaskedFieldFromFormik(
          "numberType",
          (v) => maskCPFOrCNPJ(v, values.type),
          { values, setFieldValue },
        );

        const birthField = useMaskedFieldFromFormik("dateOfBirth", maskDateBR, {
          values,
          setFieldValue,
        });

        return (
          <ModalBase
            visible={editModalVisible}
            onClose={onClose}
            title="Meus dados"
          >
            <View style={styles.overlay}>
              <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <View style={styles.container}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    <Card title="Dados pessoais">
                      <Input
                        label="Email"
                        value={values.email}
                        keyboardType="email-address"
                        onChangeText={handleChange("email")}
                        error={touched.email && errors.email}
                      />

                      <Input
                        label="Telefone"
                        keyboardType="phone-pad"
                        {...phoneField}
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
                        label="Data de nascimento"
                        placeholder="dd/mm/aaaa"
                        keyboardType="numeric"
                        {...birthField}
                        error={touched.dateOfBirth && errors.dateOfBirth}
                      />

                      <Input
                        label="Bio"
                        value={values.bio}
                        onChangeText={handleChange("bio")}
                        error={touched.bio && errors.bio}
                      />
                    </Card>

                    <Card title="Endereço">
                      <Input
                        label="CEP"
                        keyboardType="numeric"
                        {...cepField}
                        error={touched.zip && errors.zip}
                      />

                      <Row>
                        <Input
                          label="Estado"
                          maxLength={2}
                          flex={1}
                          value={values.state}
                          onChangeText={handleChange("state")}
                          error={touched.state && errors.state}
                        />
                        <Input
                          label="Cidade"
                          flex={1}
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
                          flex={1}
                          value={values.number}
                          onChangeText={handleChange("number")}
                          error={touched.number && errors.number}
                        />
                        <Input
                          label="Complemento"
                          flex={1}
                          value={values.complement}
                          onChangeText={handleChange("complement")}
                        />
                      </Row>
                    </Card>

                    <Card
                      title="Contribuição"
                      description="Dia do mês e valor mensal da sua contribuição à comunidade."
                    >
                      <Text style={styles.subLabel}>Dia da contribuição</Text>

                      <View style={styles.daysGrid}>
                        {Array.from({ length: 10 }, (_, i) => {
                          const day = String(i + 1);
                          const selected = values.datePayment === day;

                          return (
                            <TouchableOpacity
                              key={day}
                              onPress={() => handleChange("datePayment")(day)}
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
                        keyboardType="decimal-pad"
                        {...amountField}
                        error={touched.amount && errors.amount}
                      />
                    </Card>

                    <Card
                      title="Identificação"
                      description="Documento utilizado para emissão do comprovante PIX."
                    >
                      <View style={styles.toggle}>
                        {["CPF", "CNPJ"].map((type) => (
                          <TouchableOpacity
                            key={type}
                            onPress={() => {
                              savedDocValues.current[values.type] =
                                values.numberType as string;
                              handleChange("type")(type);
                              setFieldValue(
                                "numberType",
                                savedDocValues.current[type] ?? "",
                              );
                            }}
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
                        keyboardType="numeric"
                        {...documentField}
                        error={touched.numberType && errors.numberType}
                      />
                    </Card>
                  </ScrollView>

                  <View style={styles.footer}>
                    <Button
                      title="Salvar"
                      onPress={async () => {
                        const formErrors = await validateForm();

                        if (Object.keys(formErrors).length > 0) {
                          const firstError = Object.values(
                            formErrors,
                          )[0] as string;
                          ToastMessage.error("Campos inválidos", firstError);
                        }

                        handleSubmit();
                      }}
                      loading={isSubmitting}
                      disabled={!dirty || isSubmitting}
                    />
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
          </ModalBase>
        );
      }}
    </Formik>
  );
};
