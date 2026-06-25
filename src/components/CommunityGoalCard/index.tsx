import { useAppTheme } from "@/context/ThemeContext";
import { ChargeServices } from "@/services/ChargeService";
import { IGoalProgress } from "@/types/Charge";
import { useFocusEffect } from "@react-navigation/native";
import { CircleCheck, UsersRound } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { useStyles } from "./styles";

const MONTH_LABELS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function CommunityGoalCard() {
  const styles = useStyles();
  const { colors } = useAppTheme();
  const [progress, setProgress] = useState<IGoalProgress | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await ChargeServices.getGoalProgress();
      setProgress(data);
    } catch {
      // Silenciosamente esconde o card: a home não deve exibir erro de meta.
      setProgress(null);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (!progress || !Number.isFinite(progress.percent)) return null;

  const percent = Math.max(0, Math.min(100, Math.round(progress.percent)));
  const reached = percent >= 100;
  const monthLabel = MONTH_LABELS[progress.month - 1] ?? "";

  const accent =
    percent >= 70
      ? colors.success
      : percent >= 30
        ? colors.waiting
        : colors.error;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <UsersRound size={18} color={colors.primary} />
        <Text style={styles.title}>Meta da comunidade · {monthLabel}</Text>
      </View>

      <View style={styles.valueRow}>
        <Text style={[styles.percent, { color: accent }]}>{percent}%</Text>
        <Text style={styles.caption}>
          {reached ? "meta atingida!" : "da meta atingida"}
        </Text>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${percent}%`, backgroundColor: accent },
          ]}
        />
      </View>

      {reached && (
        <View style={styles.reachedRow}>
          <CircleCheck size={15} color={colors.success} />
          <Text style={styles.reachedText}>
            Meta atingida! Obrigado a todos que contribuíram.
          </Text>
        </View>
      )}
    </View>
  );
}
