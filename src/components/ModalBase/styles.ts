import { SPACING } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        safeArea: {
          flex: 1,
        },
        header: {
          marginTop: SPACING.xs,
          backgroundColor: colors.muted,
          borderRadius: 16,
          padding: 30,
          marginHorizontal: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        headerTitle: {
          color: colors.white,
          fontSize: 22,
          fontWeight: "700",
        },
      }),
    [colors],
  );
}
