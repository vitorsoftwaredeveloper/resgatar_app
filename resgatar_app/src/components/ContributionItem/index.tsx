// src/types/contribution.ts
export type ContributionStatus = "PENDING" | "PAID";

interface Contribution {
  id: string;
  month: string;
  value: string;
  status: ContributionStatus;
  description: string;
}

export interface ContributionItemProps {
  contribution: Contribution;
}

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";

interface Props {
  data: Contribution;
  onPay?: () => void;
}

export function ContributionItem({ data, onPay }: Props) {
  const isPending = data.status === "PENDING";

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
        <TouchableOpacity style={styles.button} onPress={onPay}>
          <Text style={styles.buttonText}>Pagar agora</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
