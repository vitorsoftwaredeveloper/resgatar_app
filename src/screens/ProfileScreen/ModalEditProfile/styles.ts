import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: "#00000055",
        },
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },

        card: {
          backgroundColor: colors.card,
          margin: 16,
          padding: 16,
          borderRadius: 24,
        },
        cardTitle: {
          fontSize: 18,
          fontWeight: "700",
          color: colors.text,
          marginBottom: 12,
        },

        inputWrapper: {
          marginBottom: 12,
        },
        inputLabel: {
          fontSize: 13,
          color: colors.muted,
          marginBottom: 6,
        },
        inputHighlighted: {
          borderColor: colors.waiting,
          borderWidth: 2,
        },

        row: {
          flexDirection: "row",
          gap: 12,
        },

        subLabel: {
          fontSize: 14,
          color: colors.muted,
          marginBottom: 8,
        },

        daysGrid: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 16,
        },
        dayCircle: {
          width: 44,
          height: 44,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: "center",
          justifyContent: "center",
        },
        dayCircleActive: {
          backgroundColor: colors.primary,
        },
        dayText: {
          color: colors.text,
          fontWeight: "600",
        },
        dayTextActive: {
          color: colors.white,
        },

        footer: {
          padding: 16,
          backgroundColor: colors.background,
        },
      }),
    [colors],
  );
}
