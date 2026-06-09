import { Button } from "@/components/Button";
import { ModalBase } from "@/components/ModalBase";
import { LogoResgatar } from "@/components/Svg/Logo";
import { useAppTheme } from "@/context/ThemeContext";
import { shareComprovantePDF } from "@/utils/generatePixReceipt";
import { Share2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useStyles } from "./styles";

type ComprovanteData = {
  name: string;
  email: string;
  cpf: string;
  docType?: string;
  month: string;
  paidAt: string;
  value: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  data: ComprovanteData;
};

export function ModalComprovante({ visible, onClose, data }: Props) {
  const { colors, mode } = useAppTheme();
  const styles = useStyles();
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    setSharing(true);
    try {
      await shareComprovantePDF({ ...data, themeMode: mode });
    } finally {
      setSharing(false);
    }
  };

  return (
    <ModalBase visible={visible} onClose={onClose} title="Ver Comprovante">
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
        >
          <ScrollView style={styles.container}>
            <View style={styles.header}>
              <View style={styles.logo}>
                <LogoResgatar size={150} color={colors.primary} />
              </View>
              <Text style={styles.orgName}>Comunidade Resgatar</Text>
              <Text style={styles.subtitle}>Comprovante de Pagamento</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>✓ Pagamento confirmado</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Dados do Associado</Text>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Associado</Text>
                <Text style={styles.rowValue}>{data.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>E-mail</Text>
                <Text style={styles.rowValue} numberOfLines={1}>
                  {data.email}
                </Text>
              </View>
              {data.cpf ? (
                <View style={[styles.row, styles.rowLast]}>
                  <Text style={styles.rowLabel}>{data.docType ?? "CPF"}</Text>
                  <Text style={styles.rowValue}>{data.cpf}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Detalhes do Pagamento</Text>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Referência</Text>
                <Text style={styles.rowValue}>{data.month}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Pago em</Text>
                <Text style={styles.rowValue}>{data.paidAt}</Text>
              </View>
              <View style={[styles.row, styles.rowLast]}>
                <Text style={styles.rowLabel}>Método</Text>
                <Text style={styles.rowValue}>PIX</Text>
              </View>
            </View>

            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Valor pago</Text>
              <Text style={styles.totalValue}>{data.value}</Text>
            </View>
            <View style={styles.actionsContainer}>
              <Button
                title="Compartilhar"
                leftIcon={
                  <Share2
                    color={mode === "dark" ? colors.black : colors.white}
                    size={18}
                  />
                }
                onPress={handleShare}
                loading={sharing}
                disabled={sharing}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ModalBase>
  );
}
