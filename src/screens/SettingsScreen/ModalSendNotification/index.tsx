import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { ModalBase } from "@/components/ModalBase";
import { TextArea } from "@/components/TextArea";
import { ToastMessage } from "@/components/Toast";
import { useAppTheme } from "@/context/ThemeContext";
import { NotificationServices } from "@/services/NotificationService";
import { Formik } from "formik";
import { Send } from "lucide-react-native";
import React from "react";
import { ScrollView, View } from "react-native";
import { v4 as uuid } from "uuid";
import * as Yup from "yup";
import { useStyles } from "./styles";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const notificationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Título é obrigatório")
    .min(3, "Título muito curto"),

  description: Yup.string()
    .required("Descrição é obrigatória")
    .min(5, "Descrição muito curta"),

  type: Yup.string().oneOf(["info", "alert", "warning"]).required(),
});

export function ModalSendNotification({ visible, onClose }: Props) {
  const { colors, mode } = useAppTheme();
  const styles = useStyles();

  const initialValues = {
    title: "",
    description: "",
    type: "info" as "info" | "alert" | "warning",
  };

  const handleSendNotification = async (values: typeof initialValues) => {
    const payload = {
      ...values,
      _id: uuid(),
      createdAt: new Date().toISOString(),
      isNew: true,
    };

    try {
      await NotificationServices.createNotification(payload);
      ToastMessage.success("Notificação enviada com sucesso");
      setTimeout(onClose, 2000);
    } catch {
      ToastMessage.error("Erro ao enviar notificação");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={notificationSchema}
      onSubmit={handleSendNotification}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        validateForm,
        isSubmitting,
      }) => (
        <ModalBase
          onClose={onClose}
          visible={visible}
          title="Enviar notificação"
        >
          <View style={styles.overlay}>
            <View style={styles.container}>
              <ScrollView
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
              >
                <Card title="Notificação">
                  <Input
                    label="Título"
                    value={values.title}
                    onChangeText={handleChange("title")}
                    error={touched.title && errors.title}
                  />

                  <TextArea
                    label="Descrição"
                    value={values.description}
                    onChangeText={handleChange("description")}
                    error={touched.description && errors.description}
                    numberOfLines={4}
                    placeholder="Descreva a notificação..."
                  />
                </Card>
              </ScrollView>
            </View>

            <View style={styles.footer}>
              <Button
                title="Enviar"
                leftIcon={
                  <Send
                    color={mode === "dark" ? colors.black : colors.white}
                    size={18}
                  />
                }
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
        </ModalBase>
      )}
    </Formik>
  );
}
