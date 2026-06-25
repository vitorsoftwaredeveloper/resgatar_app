import { useAppTheme } from "@/context/ThemeContext";
import { SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

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
          backgroundColor: colors.background,
        },
        warningHeader: {
          flexDirection: "row",
          alignItems: "flex-start",
          gap: SPACING.sm,
          marginBottom: SPACING.md,
        },
        warningTitle: {
          flex: 1,
          fontSize: TYPOGRAPHY.body,
          color: colors.error,
          fontWeight: "600",
          lineHeight: 20,
        },
        warningItem: {
          flexDirection: "row",
          alignItems: "flex-start",
          gap: SPACING.sm,
          marginBottom: SPACING.sm,
        },
        bullet: {
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: colors.textMuted,
          marginTop: 7,
        },
        warningText: {
          flex: 1,
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          lineHeight: 20,
        },
        confirmLabel: {
          fontSize: TYPOGRAPHY.body,
          color: colors.text,
          marginBottom: SPACING.md,
          lineHeight: 20,
        },
        footer: {
          padding: SPACING.lg,
          backgroundColor: colors.background,
        },
        deleteButton: {
          backgroundColor: colors.error,
          borderColor: colors.error,
        },
      }),
    [colors],
  );
}
