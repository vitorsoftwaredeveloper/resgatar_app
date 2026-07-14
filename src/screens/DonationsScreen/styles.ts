import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SHADOW, SPACING, TYPOGRAPHY } from "@/theme";
import { FONTS } from "@/theme/fonts";
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

        // Seletor de ano (primitiva .monthnav do browser)
        yearSelector: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: RADIUS.md,
          padding: 8,
          ...SHADOW.card,
        },
        yearLabel: {
          fontFamily: FONTS.displaySemiBold,
          fontSize: 20,
          color: colors.text,
        },
        navButton: {
          width: 38,
          height: 38,
          borderRadius: 10,
          backgroundColor: colors.inputBg,
          alignItems: "center",
          justifyContent: "center",
        },
        navButtonDisabled: {
          opacity: 0.35,
        },

        // Card de total + quebra por método (.card editorial)
        card: {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: RADIUS.lg,
          padding: SPACING.lg,
          gap: SPACING.xs,
          ...SHADOW.card,
        },
        metaCap: {
          fontSize: TYPOGRAPHY.xsmall,
          color: colors.textMuted,
          fontWeight: "700",
          letterSpacing: 1.5,
          textTransform: "uppercase",
        },
        metaLabel: {
          fontSize: TYPOGRAPHY.small,
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

        // Lista de doações em card único (.card + .lrow do browser)
        listCard: {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: RADIUS.lg,
          overflow: "hidden",
          ...SHADOW.card,
        },
        rowDivider: {
          height: 1,
          backgroundColor: colors.border,
        },
        donationItem: {
          paddingHorizontal: SPACING.md,
          paddingVertical: 14,
        },
        donationRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.sm2,
        },
        methodIcon: {
          width: 40,
          height: 40,
          borderRadius: 12,
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
          fontSize: 15,
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
