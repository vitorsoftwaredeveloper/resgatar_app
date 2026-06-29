import { useAppTheme } from "@/context/ThemeContext";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.card,
          margin: 16,
          padding: 16,
          borderRadius: 24,
        },
        cardTitle: {
          fontSize: 12,
          fontWeight: "500",
          color: colors.textMuted,
          textTransform: "uppercase",
          letterSpacing: 0.7,
          marginBottom: 4,
        },
        cardDescription: {
          fontSize: 13,
          color: colors.muted,
          marginBottom: 12,
        },
      }),
    [colors],
  );
}
