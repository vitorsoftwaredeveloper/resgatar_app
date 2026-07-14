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
        headerTitle: {
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "600",
          color: colors.textMuted,
          letterSpacing: 0.8,
          textTransform: "uppercase",
        },
        emptyState: {
          alignItems: "center",
          justifyContent: "center",
          gap: SPACING.xs,
          paddingVertical: SPACING.xl,
          marginVertical: SPACING.sm2,
          borderWidth: 1.5,
          borderStyle: "dashed",
          borderColor: colors.border,
          borderRadius: RADIUS.md,
        },
        emptyText: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },
        row: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.sm2,
          paddingVertical: SPACING.sm2,
        },
        rowBorder: {
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        methodIcon: {
          width: 32,
          height: 32,
          borderRadius: RADIUS.sm,
          backgroundColor: colors.softBrown,
          alignItems: "center",
          justifyContent: "center",
        },
        texts: {
          flex: 1,
          minWidth: 0,
          gap: 2,
        },
        name: {
          fontSize: TYPOGRAPHY.body,
          color: colors.text,
          fontWeight: "600",
        },
        meta: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },
        values: {
          alignItems: "flex-end",
          gap: 2,
        },
        value: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textStrong,
          fontWeight: "700",
          fontVariant: ["tabular-nums"],
        },
        status: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },
      }),
    [colors],
  );
}
