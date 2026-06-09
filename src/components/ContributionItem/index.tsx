import { useAppTheme } from "@/context/ThemeContext";
import { TRANSACTION_STATUS } from "@/types/Charge";
import { Eye, QrCode } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { Button } from "../Button";
import { useStyles } from "./styles";

interface Contribution {
  id: string;
  month: string;
  value: string;
  status: string;
  description: string;
}

export interface ContributionItemProps {
  contribution: Contribution;
}

interface Props {
  data: Contribution;
  onPay: () => Promise<void>;
  onShare?: () => void;
}

export function ContributionItem({ data, onPay, onShare }: Props) {
  const { colors, mode } = useAppTheme();
  const styles = useStyles();
  const isPending = data.status === TRANSACTION_STATUS.PENDING;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.month} numberOfLines={1} ellipsizeMode="tail">
            {data.month}
          </Text>
          <Text
            style={styles.description}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {data.description}
          </Text>
        </View>

        <View style={styles.right}>
          <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
            {data.value}
          </Text>

          <View
            style={[styles.badge, isPending ? styles.pending : styles.paid]}
          >
            <Text
              style={[
                styles.badgeText,
                isPending ? styles.pendingText : styles.paidText,
              ]}
            >
              {isPending ? "Pendente" : "Pago"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {isPending ? (
        <Button
          title="Pagar"
          onPress={async () => {
            await onPay();
          }}
          styleCustom={{ marginTop: 16 }}
          leftIcon={
            <QrCode
              size={20}
              color={mode === "dark" ? colors.black : colors.white}
            />
          }
        />
      ) : (
        <Button
          title="Comprovante"
          onPress={onShare}
          styleCustom={{ marginTop: 16 }}
          leftIcon={<Eye size={20} color={colors.primary} />}
          variant="secondary"
          loading={false}
        />
      )}
    </View>
  );
}
