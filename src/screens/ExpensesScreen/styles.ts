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

        // Seletor de mês (primitiva .monthnav do browser)
        monthSelector: {
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
        monthLabel: {
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

        // Card de total + breakdown (.card editorial)
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
          fontSize: 32,
          color: colors.error,
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

        // Lista de despesas em card único (.card + .lrow do browser)
        listCard: {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: RADIUS.lg,
          overflow: "hidden",
          ...SHADOW.card,
        },
        expenseItem: {
          paddingHorizontal: SPACING.md,
          paddingVertical: 14,
        },
        rowDivider: {
          height: 1,
          backgroundColor: colors.border,
        },
        expenseRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.sm2,
        },
        // Ícone em caixa (.la com danger-soft do browser)
        expenseIconBox: {
          width: 40,
          height: 40,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.error + "22",
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
          fontSize: 15,
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
          marginRight: 6,
        },
        expenseActions: {
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        },
        // Botões de ação em caixa (.icon-btn do browser)
        rowAction: {
          width: 36,
          height: 36,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.inputBg,
          alignItems: "center",
          justifyContent: "center",
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
