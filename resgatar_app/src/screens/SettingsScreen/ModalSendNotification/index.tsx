import React, { useState } from "react";
import { View, Text } from "react-native";
import { AlertTriangle, CircleAlert, Info, Send, X } from "lucide-react-native";
import { styles } from "./styles";
import { IconButton } from "@/components/IconButton";
import { COLORS } from "@/theme";
import { NotificationCard } from "@/components/NotificationCard";
import { INotification } from "@/types/Notification";
import { Input } from "@/components/Input";
import { Card } from "@/components/Card";
import { TypeButton } from "@/components/TypeButton";
import { Button } from "@/components/Button";
import { NotificationServices } from "@/services/NotificationService";
import { ToastMessage } from "@/components/Toast";
import { ModalBase } from "@/components/ModalBase";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function ModalSendNotification({ visible, onClose }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [notification, setNotification] = useState<INotification>({
    createdAt: new Date().toISOString(),
    description: "",
    isNew: true,
    title: "",
    type: "info",
    _id: "",
  });

  const handleNotification = (field: string, value: string) => {
    setNotification((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const sendNotification = async () => {
    await NotificationServices.createNotification(notification)
      .then(() => {
        ToastMessage.success("Notificação enviada com sucesso");
        onClose();
      })
      .catch(() => {
        ToastMessage.error("Erro ao enviar notificação");
      });
  };

  return (
    <ModalBase onClose={onClose} visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Enviar Notificação</Text>

            <IconButton color={COLORS.white} icon={X} onPress={onClose} />
          </View>

          <Card title="Notificação">
            <View style={styles.containerInput}>
              <Input
                label="Título"
                value={notification.title}
                onChangeText={(v: string) => handleNotification("title", v)}
              />

              <Input
                label="Descrição"
                value={notification.description}
                onChangeText={(v: string) =>
                  handleNotification("description", v)
                }
                numberOfLines={4}
                multiline
              />
            </View>

            <Text style={styles.label}>Tipo</Text>
            <View style={styles.typeRow}>
              <TypeButton
                type={notification.type}
                label="Informação"
                icon={
                  <Info
                    size={18}
                    color={notification.type === "info" ? "#3B6DF6" : "#000"}
                  />
                }
                selected={notification.type === "info"}
                onPress={() => handleNotification("type", "info")}
              />
              <TypeButton
                type={notification.type}
                label="Urgente"
                icon={
                  <CircleAlert
                    size={18}
                    color={notification.type === "alert" ? "#C0392B" : "#000"}
                  />
                }
                selected={notification.type === "alert"}
                onPress={() => handleNotification("type", "alert")}
              />
              <TypeButton
                type={notification.type}
                label="Aviso"
                icon={
                  <AlertTriangle
                    size={18}
                    color={notification.type === "warning" ? "#E6A23C" : "#000"}
                  />
                }
                selected={notification.type === "warning"}
                onPress={() => handleNotification("type", "warning")}
              />
            </View>

            <Text style={styles.label}>Preview</Text>
            <NotificationCard
              expanded={expanded}
              onToggle={() => setExpanded((expanded) => !expanded)}
              notification={{
                ...notification,
                description: notification.description.slice(0, 35) + "...",
              }}
            />
          </Card>
        </View>
        <View style={styles.footer}>
          <Button
            title="Enviar"
            leftIcon={<Send color={COLORS.white} size={18} />}
            onPress={sendNotification}
          />
        </View>
      </View>
    </ModalBase>
  );
}
