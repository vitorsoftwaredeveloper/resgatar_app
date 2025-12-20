import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { TRANSACTION_STATUS } from "@/types/Charge";
import { Button } from "../Button";

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
  onPay?: () => void;
}

export function ContributionItem({ data, onPay }: Props) {
  const isPending = data.status === TRANSACTION_STATUS.PENDING;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.icon} />

        <View style={styles.info}>
          <Text style={styles.month}>{data.month}</Text>
          <Text style={styles.description}>{data.description}</Text>
        </View>

        <View style={styles.right}>
          <Text style={styles.value}>{data.value}</Text>

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

      {isPending && (
        <Button
          title="Pagar agora"
          onPress={onPay}
          styleCustom={{ marginTop: 16 }}
        />
      )}
    </View>
  );
}
