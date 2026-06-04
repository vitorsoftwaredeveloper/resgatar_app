import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import { TRANSACTION_STATUS } from "@/types/Charge";
import { Button } from "../Button";
import { DollarSign, FileText, Share2 } from "lucide-react-native";
import { COLORS } from "@/theme";

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
  const isPending = data.status === TRANSACTION_STATUS.PENDING;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.icon}>
          <FileText size={24} color={styles.iconSvg.color} />
        </View>

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

      {isPending ? (
        <Button
          title="Pagar"
          onPress={async () => {
            await onPay();
          }}
          styleCustom={{ marginTop: 16 }}
          leftIcon={<DollarSign size={20} color={COLORS.white} />}
        />
      ) : (
        <Button
          title="Compartilhar"
          onPress={onShare}
          styleCustom={{ marginTop: 16 }}
          leftIcon={<Share2 size={20} color={COLORS.text} />}
          variant="secondary"
          loading={false}
        />
      )}
    </View>
  );
}
