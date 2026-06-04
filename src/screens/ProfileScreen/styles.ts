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
          padding: SPACING.lg,
          backgroundColor: colors.softBrown,
          paddingRight: SPACING.lg,
          paddingTop: SPACING.lg,
          borderTopLeftRadius: RADIUS.xl,
          borderTopRightRadius: RADIUS.xl,
          minHeight: "100%",
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
