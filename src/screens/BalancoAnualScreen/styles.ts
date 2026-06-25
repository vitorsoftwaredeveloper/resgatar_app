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

        // Card de meta (YTD)
        card: {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: RADIUS.md,
          padding: SPACING.md,
        },
        cardHeaderRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: SPACING.sm,
        },
        metaLabel: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
        },
        metaPercent: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          fontWeight: "600",
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
        balanceRow: {
          flexDirection: "row",
          alignItems: "stretch",
        },
        balanceItem: {
          flex: 1,
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
        balanceDivider: {
          width: 1,
          backgroundColor: colors.border,
          marginHorizontal: SPACING.sm,
        },
        balanceHint: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          marginTop: SPACING.sm2,
        },
        exportButton: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: SPACING.xs,
          marginTop: SPACING.md,
          paddingVertical: SPACING.sm2,
          borderRadius: RADIUS.sm,
          borderWidth: 1,
          borderColor: colors.primary,
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
          justifyContent: "space-between",
          alignItems: "center",
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

        // Grid de métricas
        metricGrid: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: SPACING.sm,
        },
        metricCard: {
          flexGrow: 1,
          flexBasis: "47%",
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: RADIUS.md,
          padding: SPACING.sm2,
        },
        metricHeader: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xs,
          marginBottom: SPACING.xs,
        },
        metricLabel: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },
        metricValue: {
          fontSize: TYPOGRAPHY.large,
          color: colors.textStrong,
          fontWeight: "700",
        },

        // Abas
        tabBar: {
          flexDirection: "row",
          backgroundColor: colors.softBrown,
          borderRadius: RADIUS.sm,
          padding: 4,
          gap: SPACING.xxs,
        },
        tab: {
          flex: 1,
          alignItems: "center",
          paddingVertical: SPACING.sm,
          borderRadius: RADIUS.sm - 2,
        },
        tabActive: {
          backgroundColor: colors.card,
        },
        tabText: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
        },
        tabTextActive: {
          color: colors.textStrong,
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
          fontSize: TYPOGRAPHY.body,
          color: colors.text,
          fontWeight: "600",
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
