import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        safeArea: {
          flex: 1,
        },
        header: {
          backgroundColor: colors.muted,
          borderTopLeftRadius: RADIUS.xl,
          borderTopRightRadius: RADIUS.xl,
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.xl,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        headerTitle: {
          color: colors.white,
          fontSize: TYPOGRAPHY.title,
          fontWeight: "700",
        },
      }),
    [colors],
  );
}
