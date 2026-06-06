import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SHADOW, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.card,
          borderRadius: RADIUS.md,
          padding: SPACING.md,
          marginBottom: SPACING.lg,
          ...SHADOW.card,
        },
        avatar: {
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          marginRight: SPACING.md,
          flexShrink: 0,
        },
        info: {
          flex: 1,
        },
        name: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "600",
          color: colors.textStrong,
          flexShrink: 1,
        },
        document: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          marginTop: 4,
        },
      }),
    [colors],
  );
}
