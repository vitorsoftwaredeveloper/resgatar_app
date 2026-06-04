import { RADIUS, SHADOW, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";

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
          padding: SPACING.lg,
        },
        menuCard: {
          backgroundColor: colors.card,
          borderRadius: RADIUS.md,
          paddingHorizontal: SPACING.md,
          ...SHADOW.card,
        },
        logout: {
          marginTop: SPACING.xxl,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: SPACING.sm2,
        },
        logoutText: {
          color: colors.error,
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "600",
        },
      }),
    [colors],
  );
}
