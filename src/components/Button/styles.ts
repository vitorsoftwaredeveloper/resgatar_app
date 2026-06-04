import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        button: {
          minHeight: 48,
          borderRadius: 14,
          paddingHorizontal: 24,
          alignItems: "center",
          justifyContent: "center",
        },

        primary: {
          backgroundColor: colors.primary,
        },

        secondary: {
          backgroundColor: colors.background,
          borderWidth: 1,
          borderColor: colors.background,
        },

        buttonText: {
          fontSize: 16,
          fontWeight: "600",
          color: colors.background,
        },

        textOnPrimary: {
          color: colors.background,
        },

        textOnSecondary: {
          color: colors.primary,
        },

        disabled: {
          opacity: 0.6,
        },
      }),
    [colors],
  );
}
