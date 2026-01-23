import React, { useState } from "react";
import { View, Text } from "react-native";
import { AlertTriangle, CircleAlert, Info, Send } from "lucide-react-native";
import { styles } from "./styles";
import { COLORS } from "@/theme";
import { NotificationCard } from "@/components/NotificationCard";
import { Input } from "@/components/Input";
import { Card } from "@/components/Card";
import { TypeButton } from "@/components/TypeButton";
import { Button } from "@/components/Button";
import { NotificationServices } from "@/services/NotificationService";
import { ToastMessage } from "@/components/Toast";
import { ModalBase } from "@/components/ModalBase";
import { Formik } from "formik";
import * as Yup from "yup";

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
  const [expanded, setExpanded] = useState(false);

  const initialValues = {
    title: "",
    description: "",
    type: "info" as "info" | "alert" | "warning",
  };

  const handleSendNotification = async (values: typeof initialValues) => {
    const payload = {
      ...values,
      _id: crypto.randomUUID(),
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
        setFieldValue,
        handleSubmit,
        isSubmitting,
      }) => (
        <ModalBase
          onClose={onClose}
          visible={visible}
          title="Enviar notificação"
        >
          <View style={styles.overlay}>
            <View style={styles.container}>
              <Card title="Notificação">
                <View style={styles.containerInput}>
                  <Input
                    label="Título"
                    value={values.title}
                    onChangeText={handleChange("title")}
                    error={touched.title && errors.title}
                  />

                  <Input
                    label="Descrição"
                    value={values.description}
                    onChangeText={handleChange("description")}
                    error={touched.description && errors.description}
                    numberOfLines={4}
                    multiline
                  />
                </View>

                <Text style={styles.label}>Tipo</Text>
                <View style={styles.typeRow}>
                  <TypeButton
                    label="Informação"
                    type="info"
                    selected={values.type === "info"}
                    onPress={() => setFieldValue("type", "info")}
                    icon={
                      <Info
                        size={18}
                        color={values.type === "info" ? "#3B6DF6" : "#000"}
                      />
                    }
                  />

                  <TypeButton
                    label="Urgente"
                    type="alert"
                    selected={values.type === "alert"}
                    onPress={() => setFieldValue("type", "alert")}
                    icon={
                      <CircleAlert
                        size={18}
                        color={values.type === "alert" ? "#C0392B" : "#000"}
                      />
                    }
                  />

                  <TypeButton
                    label="Aviso"
                    type="warning"
                    selected={values.type === "warning"}
                    onPress={() => setFieldValue("type", "warning")}
                    icon={
                      <AlertTriangle
                        size={18}
                        color={values.type === "warning" ? "#E6A23C" : "#000"}
                      />
                    }
                  />
                </View>

                <Text style={styles.label}>Preview</Text>
                <NotificationCard
                  expanded={expanded}
                  onToggle={() => setExpanded((prev) => !prev)}
                  notification={{
                    _id: "1",
                    title: values.title,
                    type: values.type,
                    isNew: true,
                    createdAt: new Date().toISOString(),
                    description:
                      values.description.length > 35
                        ? values.description.slice(0, 35) + "..."
                        : values.description,
                  }}
                />
              </Card>
            </View>

            <View style={styles.footer}>
              <Button
                title="Enviar"
                leftIcon={<Send color={COLORS.white} size={18} />}
                onPress={handleSubmit as any}
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
