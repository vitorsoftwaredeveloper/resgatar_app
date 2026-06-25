import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
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
        footer: {
          padding: SPACING.md,
          backgroundColor: colors.background,
        },
        fieldLabel: {
          fontSize: TYPOGRAPHY.body,
          color: colors.text,
          fontWeight: "600",
          marginBottom: SPACING.xs,
        },
        categoryGrid: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: SPACING.xs,
          marginBottom: SPACING.xs,
        },
        categoryChip: {
          paddingHorizontal: SPACING.sm2,
          paddingVertical: SPACING.xs,
          borderRadius: RADIUS.sm,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.card,
        },
        categoryChipSelected: {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        },
        categoryChipText: {
          fontSize: TYPOGRAPHY.body,
          color: colors.text,
        },
        categoryChipTextSelected: {
          color: colors.white,
          fontWeight: "600",
        },
        errorText: {
          fontSize: TYPOGRAPHY.small,
          color: colors.error,
          marginBottom: SPACING.xs,
        },
      }),
    [colors],
  );
}
