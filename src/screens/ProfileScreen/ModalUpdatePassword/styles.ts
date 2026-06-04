import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: colors.background,
        },
        container: {
          backgroundColor: colors.background,
        },

        footer: {
          padding: 16,
          backgroundColor: colors.background,
        },
      }),
    [colors],
  );
}
