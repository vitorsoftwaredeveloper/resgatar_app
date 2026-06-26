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
          gap: SPACING.sm,
        },
        emptyText: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          textAlign: "center",
        },

        // Seletor de mês
        monthSelector: {
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
        monthLabel: {
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

        // Card de total + breakdown
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
        breakdownLabel: {
          fontSize: TYPOGRAPHY.body,
          color: colors.text,
        },
        breakdownValue: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textStrong,
          fontWeight: "600",
        },

        // Item de despesa
        expenseCard: {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: RADIUS.md,
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.sm2,
        },
        expenseRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.sm2,
        },
        expenseDetails: {
          marginTop: SPACING.sm,
          paddingTop: SPACING.sm,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          gap: SPACING.xs,
        },
        detailRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: SPACING.md,
        },
        detailLabel: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },
        detailValue: {
          fontSize: TYPOGRAPHY.small,
          color: colors.text,
          fontWeight: "600",
          flexShrink: 1,
          textAlign: "right",
        },
        expenseInfo: {
          flex: 1,
          minWidth: 0,
          gap: 2,
        },
        expenseName: {
          fontSize: TYPOGRAPHY.body,
          color: colors.text,
          fontWeight: "600",
        },
        expenseMeta: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },
        expenseValue: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textStrong,
          fontWeight: "700",
        },
        expenseActions: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xs,
        },
        rowAction: {
          padding: SPACING.xs,
        },

        // FAB
        fab: {
          position: "absolute",
          right: SPACING.lg,
          bottom: SPACING.xl,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000000",
          shadowOpacity: 0.2,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
          elevation: 5,
        },
      }),
    [colors],
  );
}
