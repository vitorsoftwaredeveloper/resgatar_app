import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        content: {
          flex: 1,
          backgroundColor: colors.softBrown,
          borderTopLeftRadius: RADIUS.xl,
          borderTopRightRadius: RADIUS.xl,
          overflow: "hidden",
        },
        screenTitle: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: 0.8,
          paddingHorizontal: SPACING.md,
          paddingTop: SPACING.md,
        },
        list: {
          padding: SPACING.md,
          gap: SPACING.sm2,
        },
        centered: {
          paddingVertical: SPACING.xxl,
          alignItems: "center",
          justifyContent: "center",
          gap: SPACING.sm,
        },
        emptyText: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          textAlign: "center",
        },

        // Seletor de ano
        yearSelector: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: RADIUS.md,
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.sm2,
        },
        yearLabel: {
          fontSize: TYPOGRAPHY.subtitle,
          color: colors.text,
          fontWeight: "600",
        },
        navButton: {
          padding: 2,
        },
        navButtonDisabled: {
          opacity: 0.3,
        },

        // Card de total + quebra por método
        card: {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: RADIUS.md,
          padding: SPACING.md,
          gap: SPACING.xs,
        },
        metaLabel: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
        },
        totalValue: {
          fontSize: TYPOGRAPHY.hero,
          color: colors.textStrong,
          fontWeight: "700",
        },
        breakdown: {
          marginTop: SPACING.sm,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: SPACING.sm,
          gap: SPACING.xs,
        },
        breakdownRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        breakdownLabelRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xs,
        },
        breakdownLabel: {
          fontSize: TYPOGRAPHY.body,
          color: colors.text,
        },
        breakdownValue: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textStrong,
          fontWeight: "600",
        },

        // Item de doação
        donationCard: {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: RADIUS.md,
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.sm2,
        },
        donationRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.sm2,
        },
        methodIcon: {
          width: 32,
          height: 32,
          borderRadius: RADIUS.sm,
          backgroundColor: colors.softBrown,
          alignItems: "center",
          justifyContent: "center",
        },
        donationInfo: {
          flex: 1,
          minWidth: 0,
          gap: 2,
        },
        donationName: {
          fontSize: TYPOGRAPHY.body,
          color: colors.text,
          fontWeight: "600",
        },
        donationMeta: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },
        donationValues: {
          alignItems: "flex-end",
          gap: 2,
        },
        donationValue: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textStrong,
          fontWeight: "700",
        },
        donationStatus: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },
      }),
    [colors],
  );
}
