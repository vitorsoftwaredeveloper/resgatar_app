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
        scroll: {
          flex: 1,
        },
        content: {
          paddingLeft: SPACING.lg,
          backgroundColor: colors.softBrown,
          paddingRight: SPACING.lg,
          paddingTop: SPACING.lg,
          borderTopLeftRadius: RADIUS.xl,
          borderTopRightRadius: RADIUS.xl,
          minHeight: "100%",
        },
        errorContainer: {
          alignItems: "center",
          paddingVertical: 56,
          gap: SPACING.sm2,
        },
        errorTitle: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "700",
          color: colors.textStrong,
        },
        errorSubtitle: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          textAlign: "center",
        },
        retryButton: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xxs,
          marginTop: SPACING.sm,
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.sm,
          borderRadius: RADIUS.sm,
          backgroundColor: colors.softBrown,
        },
        retryText: {
          fontSize: TYPOGRAPHY.body,
          color: colors.primary,
          fontWeight: "600",
        },
      }),
    [colors],
  );
}
