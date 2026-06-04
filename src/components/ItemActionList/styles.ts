import { SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingVertical: SPACING.md,
          position: "relative",
        },
        left: {
          position: "absolute",
          left: 0,
          top: 18,
        },
        icon: {
          justifyContent: "center",
          alignItems: "center",
          width: 40,
          height: 40,
          backgroundColor: colors.background,
          borderRadius: SPACING.sm2,
        },
        center: {
          marginLeft: 56,
          marginRight: SPACING.xl,
        },
        title: {
          fontSize: 15,
          fontWeight: "600",
          color: colors.textStrong,
        },
        description: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          marginTop: 2,
        },
        arrow: {
          position: "absolute",
          right: 0,
          top: 22,
          fontSize: 22,
          color: colors.textMuted,
        },
        divider: {
          height: 1,
          backgroundColor: colors.border,
          marginTop: SPACING.md,
          marginLeft: 56,
        },
      }),
    [colors],
  );
}
