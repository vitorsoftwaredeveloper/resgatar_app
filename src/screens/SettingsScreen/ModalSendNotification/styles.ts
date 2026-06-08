import { useAppTheme } from "@/context/ThemeContext";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

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
