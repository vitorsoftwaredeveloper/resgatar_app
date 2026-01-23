import React, { useContext, useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { Input } from "@/components/Input";
import { AuthContext } from "@/context/AuthContext";
import { Card } from "@/components/Card";
import { Eye, EyeOff } from "lucide-react-native";
import { COLORS } from "@/theme";
import { Button } from "@/components/Button";
import { ToastMessage } from "@/components/Toast";
import { ModalBase } from "@/components/ModalBase";
import { Formik } from "formik";
import * as Yup from "yup";

interface IModalUpdatePassword {
  passwordModalVisible: boolean;
  onClose: () => void;
  memberIdPasswordWillBeChanged?: string;
}

const passwordValidationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Senha é obrigatória")
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .matches(
      /^(?=.*[a-z])/,
      "A senha deve conter pelo menos uma letra minúscula",
    )
    .matches(
      /^(?=.*[A-Z])/,
      "A senha deve conter pelo menos uma letra maiúscula",
    )
    .matches(/^(?=.*\d)/, "A senha deve conter pelo menos um número")
    .matches(
      /^(?=.*[@$!%*?&#])/,
      "A senha deve conter pelo menos um caractere especial: @$!%*?&#",
    ),

  confirmPassword: Yup.string()
    .required("Confirmação de senha é obrigatória")
    .oneOf([Yup.ref("password")], "As senhas não conferem"),
});

export const ModalUpdatePassword = ({
  passwordModalVisible,
  onClose,
  memberIdPasswordWillBeChanged,
}: IModalUpdatePassword) => {
  const { changePassword, member } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const handleSavePassword = async (
    { password }: { password: string },
    { setSubmitting }: any,
  ) => {
    await changePassword(
      memberIdPasswordWillBeChanged
        ? memberIdPasswordWillBeChanged
        : (member?._id as string),
      password,
    )
      .then(() => {
        ToastMessage.success("Senha alterada com sucesso");
        setTimeout(() => {
          onClose();
        }, 2000);
      })
      .catch(() => {
        ToastMessage.error("Erro ao atualizar senha");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <ModalBase
      visible={passwordModalVisible}
      onClose={onClose}
      title="Atualizar senha"
    >
      <Formik
        initialValues={{
          password: "",
          confirmPassword: "",
        }}
        validationSchema={passwordValidationSchema}
        onSubmit={handleSavePassword}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          validateForm,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <View style={styles.overlay}>
            <View style={styles.container}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Card title="Senha">
                  <Input
                    label="Nova senha"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    keyboardType="default"
                    secureTextEntry={!showPassword}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <Eye size={24} color={COLORS.muted} />
                        ) : (
                          <EyeOff size={24} color={COLORS.muted} />
                        )}
                      </TouchableOpacity>
                    }
                    error={touched.password && errors.password}
                  />

                  <Input
                    label="Confirmar senha"
                    value={values.confirmPassword}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    keyboardType="default"
                    secureTextEntry={!showPassword}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <Eye size={24} color={COLORS.muted} />
                        ) : (
                          <EyeOff size={24} color={COLORS.muted} />
                        )}
                      </TouchableOpacity>
                    }
                    error={touched.confirmPassword && errors.confirmPassword}
                  />
                </Card>
              </ScrollView>

              <View style={styles.footer}>
                <Button
                  title="Salvar"
                  onPress={async () => {
                    const formErrors = await validateForm();

                    if (Object.keys(formErrors).length > 0) {
                      ToastMessage.error(
                        "Campos inválidos",
                        "Campos preenchidos incorretamente.",
                      );
                    }

                    handleSubmit();
                  }}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                />
              </View>
            </View>
          </View>
        )}
      </Formik>
    </ModalBase>
  );
};
