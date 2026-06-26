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
        receiptHint: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          marginBottom: SPACING.sm,
        },
        receiptPreviewWrap: {
          marginBottom: SPACING.sm,
        },
        receiptPreview: {
          position: "relative",
          width: "100%",
        },
        receiptImage: {
          width: "100%",
          height: 220,
          borderRadius: RADIUS.sm,
          borderWidth: 1,
          borderColor: colors.border,
        },
        receiptRemoveBadge: {
          position: "absolute",
          top: SPACING.xs,
          right: SPACING.xs,
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: colors.error,
          alignItems: "center",
          justifyContent: "center",
        },
        receiptAttachedText: {
          fontSize: TYPOGRAPHY.body,
          color: colors.text,
          fontWeight: "600",
          marginBottom: SPACING.sm,
        },
        receiptActions: {
          flexDirection: "row",
          gap: SPACING.sm,
        },
        receiptActionButton: {
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: SPACING.xs,
          paddingVertical: SPACING.sm,
          borderRadius: RADIUS.sm,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.card,
        },
        receiptActionText: {
          fontSize: TYPOGRAPHY.body,
          color: colors.text,
          fontWeight: "600",
        },
      }),
    [colors],
  );
}
