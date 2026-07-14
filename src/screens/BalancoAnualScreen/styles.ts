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

        // Card de meta/mês/balanço (.card editorial: radius lg + sombra)
        card: {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: RADIUS.lg,
          padding: SPACING.lg,
          ...SHADOW.card,
        },
        cardHeaderRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: SPACING.sm,
        },
        metaCap: {
          fontSize: TYPOGRAPHY.xsmall,
          color: colors.textMuted,
          fontWeight: "700",
          letterSpacing: 1.5,
          textTransform: "uppercase",
        },
        metaLabel: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
        },
        metaPercent: {
          fontSize: TYPOGRAPHY.subtitle,
          color: colors.success,
          fontWeight: "700",
        },
        metaValueRow: {
          flexDirection: "row",
          alignItems: "baseline",
          gap: SPACING.xs,
          marginBottom: SPACING.sm2,
        },
        metaCollected: {
          fontSize: TYPOGRAPHY.hero,
          color: colors.textStrong,
          fontWeight: "700",
        },
        metaGoal: {
          fontSize: TYPOGRAPHY.subtitle,
          color: colors.textMuted,
        },
        progressTrack: {
          height: 10,
          borderRadius: 6,
          backgroundColor: colors.softBrown,
          overflow: "hidden",
          marginBottom: SPACING.sm2,
        },
        progressFill: {
          height: "100%",
          borderRadius: 6,
          backgroundColor: colors.success,
        },
        remainingRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xs,
        },
        remainingText: {
          fontSize: TYPOGRAPHY.body,
          color: colors.text,
        },
        remainingStrong: {
          fontWeight: "700",
        },
        goalReachedText: {
          fontSize: TYPOGRAPHY.body,
          color: colors.success,
          fontWeight: "600",
        },

        // Card de balanço (entradas x saídas x saldo)
        balanceTitle: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textStrong,
          fontWeight: "700",
          marginBottom: SPACING.sm2,
        },
        // Grid 2×2 (Entradas/Doações · Saídas/Saldo), como o browser
        balanceRow: {
          flexDirection: "row",
          flexWrap: "wrap",
          rowGap: SPACING.md,
          columnGap: SPACING.sm2,
        },
        balanceItem: {
          flexBasis: "47%",
          flexGrow: 1,
          gap: SPACING.xxs,
        },
        balanceItemHeader: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xxs,
        },
        balanceItemLabel: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },
        balanceValueIn: {
          fontSize: TYPOGRAPHY.large,
          color: colors.success,
          fontWeight: "700",
        },
        balanceValueOut: {
          fontSize: TYPOGRAPHY.large,
          color: colors.error,
          fontWeight: "700",
        },
        balanceValueNet: {
          fontSize: TYPOGRAPHY.large,
          fontWeight: "700",
        },
        balanceHint: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          marginTop: SPACING.sm2,
        },
        exportRow: {
          flexDirection: "row",
          gap: SPACING.sm,
          marginTop: SPACING.md,
        },
        exportButton: {
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: SPACING.xs,
          paddingVertical: SPACING.sm2,
          paddingHorizontal: SPACING.xs,
          borderRadius: RADIUS.md,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.softBrown,
        },
        exportButtonText: {
          fontSize: TYPOGRAPHY.body,
          color: colors.primary,
          fontWeight: "600",
        },

        // Linha de saídas/resultado dentro do card de mês
        monthBalanceRow: {
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          columnGap: SPACING.md,
          rowGap: SPACING.xs,
          marginTop: SPACING.sm,
          paddingTop: SPACING.sm,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        monthBalanceItem: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xxs,
        },
        monthBalanceLabel: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },
        monthOut: {
          fontSize: TYPOGRAPHY.small,
          color: colors.error,
          fontWeight: "600",
        },
        monthNet: {
          fontSize: TYPOGRAPHY.small,
          fontWeight: "700",
        },

        // Grid de métricas (.tile do browser)
        metricGrid: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: SPACING.sm2,
        },
        metricCard: {
          flexGrow: 1,
          flexBasis: "47%",
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: RADIUS.md,
          paddingVertical: 16,
          paddingHorizontal: 16,
          ...SHADOW.card,
        },
        metricHeader: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xs,
          marginBottom: SPACING.sm,
        },
        metricIcon: {
          width: 30,
          height: 30,
          borderRadius: 9,
          backgroundColor: colors.inputBg,
          alignItems: "center",
          justifyContent: "center",
        },
        metricLabel: {
          fontSize: 13,
          color: colors.textMuted,
          fontWeight: "600",
          flexShrink: 1,
        },
        metricValue: {
          fontSize: 24,
          color: colors.textStrong,
          fontWeight: "700",
        },

        // Abas (.tabs do browser: pílula, ativo = marrom)
        tabBar: {
          flexDirection: "row",
          backgroundColor: colors.softBrown,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 999,
          padding: 5,
          gap: 6,
        },
        tab: {
          flex: 1,
          alignItems: "center",
          paddingVertical: SPACING.sm,
          borderRadius: 999,
        },
        tabActive: {
          backgroundColor: colors.primary,
          ...SHADOW.card,
        },
        tabText: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          fontWeight: "600",
        },
        tabTextActive: {
          color: colors.white,
          fontWeight: "600",
        },

        // Linha de mês
        monthCardHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: SPACING.xs,
        },
        monthName: {
          fontFamily: FONTS.displaySemiBold,
          fontSize: 20,
          color: colors.text,
        },
        monthValueRow: {
          flexDirection: "row",
          alignItems: "baseline",
          gap: SPACING.xs,
          marginBottom: SPACING.sm,
        },
        monthCollected: {
          fontSize: TYPOGRAPHY.subtitle,
          color: colors.textStrong,
          fontWeight: "700",
        },
        monthGoal: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },
        monthSplitRow: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: SPACING.sm2,
          marginTop: SPACING.sm,
        },
        monthSplitItem: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xxs,
        },
        monthSplitText: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },

        // Item de membro
        memberCard: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.sm2,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: RADIUS.md,
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.sm2,
        },
        memberInfo: {
          flex: 1,
          minWidth: 0,
          gap: 2,
        },
        memberName: {
          fontSize: TYPOGRAPHY.body,
          color: colors.text,
          fontWeight: "600",
        },
        memberMeta: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },
        memberValues: {
          alignItems: "flex-end",
        },
        memberValue: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textStrong,
          fontWeight: "700",
        },
        memberDue: {
          fontSize: TYPOGRAPHY.small,
          color: colors.error,
          fontWeight: "600",
        },
      }),
    [colors],
  );
}
