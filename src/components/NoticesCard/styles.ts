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
          backgroundColor: colors.card,
          borderRadius: RADIUS.md,
          paddingHorizontal: SPACING.md,
          marginBottom: SPACING.md,
          borderWidth: 1,
          borderColor: colors.border,
        },
        header: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: SPACING.sm,
          paddingVertical: SPACING.sm2,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerLeft: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.sm,
          flexShrink: 1,
        },
        headerTitle: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "700",
          color: colors.textStrong,
        },
        emptyText: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          paddingVertical: SPACING.md,
        },

        titleRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xs,
        },
        todayTag: {
          paddingHorizontal: SPACING.xs,
          paddingVertical: 1,
          borderRadius: RADIUS.sm,
          backgroundColor: colors.waiting,
        },
        todayTagText: {
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "800",
          letterSpacing: 0.5,
          color: "#3E2C1C",
        },
        timeTag: {
          fontWeight: "700",
          color: colors.text,
        },
        row: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.sm,
          paddingVertical: SPACING.sm2,
        },
        rowBorder: {
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        // Linha de hoje: bloco destacado em âmbar suave.
        rowToday: {
          backgroundColor: "rgba(224,185,106,0.18)",
          borderRadius: RADIUS.sm,
          paddingHorizontal: SPACING.sm,
          marginVertical: SPACING.xs,
        },
        texts: {
          flexShrink: 1,
        },
        title: {
          fontSize: TYPOGRAPHY.body,
          fontWeight: "600",
          color: colors.text,
          flexShrink: 1,
        },
        titleToday: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "800",
          color: colors.textStrong,
        },
        date: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          marginTop: 2,
        },
        dateToday: {
          color: colors.text,
        },
      }),
    [colors],
  );
}
