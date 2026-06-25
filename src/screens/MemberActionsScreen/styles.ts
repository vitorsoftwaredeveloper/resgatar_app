import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SHADOW, SPACING } from "@/theme";
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
