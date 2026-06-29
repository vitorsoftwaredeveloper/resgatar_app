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
          backgroundColor: colors.background,
        },
        container: {
          gap: 8,
          padding: 16,
        },
        quickAmounts: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 4,
        },
        chip: {
          flexGrow: 1,
          minWidth: 70,
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.background,
          alignItems: "center",
        },
        chipSelected: {
          borderColor: colors.primary,
          backgroundColor: colors.primary,
        },
        chipText: {
          fontSize: 15,
          fontWeight: "600",
          color: colors.text,
        },
        chipTextSelected: {
          color: colors.white,
        },
        hint: {
          fontSize: 12,
          color: colors.textMuted,
          marginBottom: 8,
        },
        actions: {
          flexDirection: "row",
          gap: 8,
          marginTop: 8,
        },
        actionButton: {
          flex: 1,
          borderWidth: 1,
          borderColor: colors.primary,
        },
      }),
    [colors],
  );
}
