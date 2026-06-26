import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SHADOW, SPACING, TYPOGRAPHY } from "@/theme";
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
          padding: SPACING.lg,
          backgroundColor: colors.softBrown,
          borderTopLeftRadius: RADIUS.xl,
          borderTopRightRadius: RADIUS.xl,
        },
        sectionGroup: {
          gap: SPACING.xs,
        },
        sectionLabel: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: 0.8,
          paddingHorizontal: SPACING.xs,
        },
        menuCard: {
          backgroundColor: colors.card,
          borderRadius: RADIUS.md,
          paddingHorizontal: SPACING.md,
          ...SHADOW.card,
        },
      }),
    [colors],
  );
}
