import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { DocTypeToggle } from "@/components/DocTypeToggle";
import { Input } from "@/components/Input";
import { ModalPhotoPicker } from "@/components/ModalPhotoPicker";
import { LogoResgatar } from "@/components/Svg/Logo";
import { ToastMessage } from "@/components/Toast";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { useMaskedFieldFromFormik } from "@/hooks/useMaskedField";
import { RootStackParamList } from "@/navigation/types";
import { getApiErrorMessage } from "@/utils/apiError";
import {
  maskCPFOrCNPJ,
  maskPhoneBR,
  onlyNumbers,
  validateCNPJ,
  validateCPF,
  validateEmailDomain,
} from "@/utils/mask";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Formik } from "formik";
import {
  Eye,
  EyeOff,
  IdCard,
  Mail,
  Phone,
  UserRound,
  UserRoundPlus,
} from "lucide-react-native";
import React, { useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import { useStyles } from "./styles";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const registerSchema = Yup.object().shape({
  firstName: Yup.string().required("Nome obrigatório"),
  lastName: Yup.string().required("Sobrenome obrigatório"),
  email: Yup.string()
    .email("Email inválido")
    .test("email-domain", "Domínio de email não permitido", (v) =>
      validateEmailDomain(v || ""),
    )
    .required("Email obrigatório"),
  phoneNumber: Yup.string()
    .test(
      "phone",
      "Telefone inválido",
      (v) => onlyNumbers(v || "").length >= 10,
    )
    .required("Telefone obrigatório"),
  type: Yup.string().oneOf(["CPF", "CNPJ"]).required(),
  numberType: Yup.string()
    .test("doc", "Documento inválido", (value, ctx) => {
      const type = ctx.parent.type;
      return type === "CPF"
        ? validateCPF(value || "")
        : validateCNPJ(value || "");
    })
    .required("Documento obrigatório"),
  password: Yup.string()
    .required("Senha obrigatória")
    .min(8, "Mínimo 8 caracteres")
    .matches(/^(?=.*[a-z])/, "Deve conter letra minúscula")
    .matches(/^(?=.*[A-Z])/, "Deve conter letra maiúscula")
    .matches(/^(?=.*\d)/, "Deve conter número")
    .matches(/^(?=.*[@$!%*?&#])/, "Deve conter caractere especial @$!%*?&#"),
  confirmPassword: Yup.string()
    .required("Confirmação obrigatória")
    .oneOf([Yup.ref("password")], "As senhas não conferem"),
});

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  type: "CPF" as "CPF" | "CNPJ",
  numberType: "",
  password: "",
  confirmPassword: "",
  profileImage: "",
};

export const RegisterScreen = ({ navigation }: Props) => {
  const { register } = useContext(AuthContext);
  const styles = useStyles();
  const { colors } = useAppTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  const handleRegister = async (values: typeof initialValues) => {
    await register({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phoneNumber: onlyNumbers(values.phoneNumber),
      password: values.password,
      type: values.type,
      numberType: onlyNumbers(values.numberType),
      profileImage: values.profileImage || undefined,
    })
      .then(() => {
        ToastMessage.success("Sucesso", "Cadastro realizado!");
        navigation.goBack();
      })
      .catch((error) => {
        ToastMessage.error(
          "Erro",
          getApiErrorMessage(
            error,
            "Não foi possível criar a conta. Tente novamente.",
          ),
        );
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerSchema}
      onSubmit={handleRegister}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        setFieldValue,
        handleSubmit,
        validateForm,
        isSubmitting,
      }) => {
        const phoneField = useMaskedFieldFromFormik(
          "phoneNumber",
          maskPhoneBR,
          {
            values,
            setFieldValue,
          },
        );

        const docField = useMaskedFieldFromFormik(
          "numberType",
          (v) => maskCPFOrCNPJ(v, values.type),
          { values, setFieldValue },
        );

        return (
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.background}>
                <View style={styles.card}>
                  <View style={styles.logoContainer}>
                    <LogoResgatar color={colors.primary} size={200} />
                  </View>

                  <Text style={styles.title}>Criar conta</Text>

                  <View style={styles.photoPicker}>
                    <Avatar
                      photo={values.profileImage}
                      size={96}
                      editable
                      onPress={() => setPhotoModalVisible(true)}
                    />
                    <Text style={styles.photoHint}>
                      Toque para adicionar uma foto (opcional)
                    </Text>
                  </View>

                  {photoModalVisible && (
                    <ModalPhotoPicker
                      visible={photoModalVisible}
                      onClose={() => setPhotoModalVisible(false)}
                      currentPhoto={values.profileImage}
                      onConfirm={(photo) => {
                        setFieldValue("profileImage", photo);
                        setPhotoModalVisible(false);
                      }}
                    />
                  )}

                  <View style={styles.form}>
                    <View style={styles.row}>
                      <View style={styles.halfField}>
                        <Input
                          placeholder="Nome"
                          value={values.firstName}
                          onChangeText={handleChange("firstName")}
                          autoCapitalize="words"
                          error={touched.firstName && errors.firstName}
                          rightIcon={
                            <UserRound size={20} color={colors.muted} />
                          }
                        />
                      </View>
                      <View style={styles.halfField}>
                        <Input
                          placeholder="Sobrenome"
                          value={values.lastName}
                          onChangeText={handleChange("lastName")}
                          autoCapitalize="words"
                          error={touched.lastName && errors.lastName}
                          rightIcon={
                            <UserRound size={20} color={colors.muted} />
                          }
                        />
                      </View>
                    </View>

                    <Input
                      placeholder="Email"
                      value={values.email}
                      onChangeText={handleChange("email")}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      error={touched.email && errors.email}
                      rightIcon={<Mail size={20} color={colors.muted} />}
                    />

                    <Input
                      placeholder="Telefone"
                      keyboardType="phone-pad"
                      error={touched.phoneNumber && errors.phoneNumber}
                      rightIcon={<Phone size={20} color={colors.muted} />}
                      {...phoneField}
                    />

                    <DocTypeToggle
                      value={values.type}
                      onChange={(type) => {
                        setFieldValue("type", type);
                        setFieldValue("numberType", "");
                      }}
                    />

                    <Input
                      placeholder={
                        values.type === "CPF"
                          ? "000.000.000-00"
                          : "00.000.000/0000-00"
                      }
                      keyboardType="numeric"
                      error={touched.numberType && errors.numberType}
                      rightIcon={<IdCard size={20} color={colors.muted} />}
                      {...docField}
                    />

                    <Input
                      placeholder="Senha"
                      value={values.password}
                      secureTextEntry={!showPassword}
                      onChangeText={handleChange("password")}
                      error={touched.password && errors.password}
                      rightIcon={
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <Eye size={20} color={colors.muted} />
                          ) : (
                            <EyeOff size={20} color={colors.muted} />
                          )}
                        </TouchableOpacity>
                      }
                    />

                    <Input
                      placeholder="Confirmar senha"
                      value={values.confirmPassword}
                      secureTextEntry={!showPassword}
                      onChangeText={handleChange("confirmPassword")}
                      error={touched.confirmPassword && errors.confirmPassword}
                      rightIcon={
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <Eye size={20} color={colors.muted} />
                          ) : (
                            <EyeOff size={20} color={colors.muted} />
                          )}
                        </TouchableOpacity>
                      }
                    />
                  </View>

                  <Button
                    title="Criar conta"
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
                    styleCustom={styles.submitButton}
                    leftIcon={
                      <UserRoundPlus size={20} color={colors.background} />
                    }
                    loading={isSubmitting}
                  />

                  <View style={styles.loginLink}>
                    <Text style={styles.loginLinkText}>Já tem uma conta? </Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <Text style={styles.loginLinkAction}>Entrar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        );
      }}
    </Formik>
  );
};
