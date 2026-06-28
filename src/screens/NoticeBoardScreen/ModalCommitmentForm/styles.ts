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
        // Mesmo visual do label do Input (13px, muted, sem bold).
        fieldLabel: {
          fontSize: 13,
          color: colors.muted,
          marginBottom: 6,
        },
        errorText: {
          fontSize: TYPOGRAPHY.small,
          color: colors.error,
          marginTop: 4,
        },

        // Seletor de frequência (weekly / monthly / once).
        segment: {
          flexDirection: "row",
          borderRadius: RADIUS.lg,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
          marginBottom: SPACING.sm2,
        },
        segmentItem: {
          flex: 1,
          paddingVertical: SPACING.sm2,
          alignItems: "center",
        },
        segmentItemActive: {
          backgroundColor: colors.primary,
        },
        segmentText: {
          fontSize: TYPOGRAPHY.body,
          fontWeight: "600",
          color: colors.text,
        },
        segmentTextActive: {
          color: colors.white,
          fontWeight: "700",
        },

        // Chips de dia da semana / ordinal.
        chipsRow: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: SPACING.xs,
          marginBottom: SPACING.sm2,
        },
        chip: {
          paddingHorizontal: SPACING.sm2,
          paddingVertical: SPACING.xs,
          borderRadius: RADIUS.sm,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.inputBg,
          minWidth: 44,
          alignItems: "center",
        },
        chipActive: {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        },
        chipText: {
          fontSize: TYPOGRAPHY.small,
          fontWeight: "600",
          color: colors.text,
        },
        chipTextActive: {
          color: colors.white,
          fontWeight: "700",
        },

        footer: {
          padding: SPACING.md,
          backgroundColor: colors.background,
        },
        footerRow: {
          flexDirection: "row",
          gap: SPACING.sm,
        },
        saveFlex: {
          flex: 1.4,
        },
        // Mesma altura/raio do Button, com aparência destrutiva (contorno).
        deleteButton: {
          flex: 1,
          minHeight: 48,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.error,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          paddingHorizontal: SPACING.md,
        },
        deleteText: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "600",
          color: colors.error,
        },
      }),
    [colors],
  );
}
