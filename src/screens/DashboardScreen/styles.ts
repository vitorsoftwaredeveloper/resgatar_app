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
          paddingHorizontal: SPACING.lg,
          backgroundColor: colors.softBrown,
          paddingTop: SPACING.lg,
          borderTopLeftRadius: RADIUS.xl,
          borderTopRightRadius: RADIUS.xl,
          minHeight: "100%",
        },
        hint: {
          marginBottom: SPACING.sm,
        },
        hintInner: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xs,
          backgroundColor: colors.card,
          borderLeftWidth: 3,
          borderLeftColor: colors.primary,
          borderRadius: RADIUS.sm,
          paddingHorizontal: SPACING.sm2,
          paddingVertical: SPACING.sm,
        },
        hintText: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          flex: 1,
        },
        cardWrapper: {},
        cardWrapperActive: {
          opacity: 0.85,
          transform: [{ scale: 1.02 }],
        },
      }),
    [colors],
  );
}
