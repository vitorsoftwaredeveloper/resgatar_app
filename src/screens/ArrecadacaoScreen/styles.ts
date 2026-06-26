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

        // Card de meta
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
        metricValueSuffix: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          fontWeight: "400",
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
        memberValue: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textStrong,
          fontWeight: "700",
        },
      }),
    [colors],
  );
}
