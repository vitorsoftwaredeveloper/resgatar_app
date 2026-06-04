import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        inputWrapper: {
          marginBottom: 12,
        },

        inputLabel: {
          fontSize: 13,
          color: colors.muted,
          marginBottom: 6,
        },

        inputContainer: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.inputBg,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 20,
          paddingHorizontal: 14,
        },

        input: {
          flex: 1,
          paddingVertical: 14,
          color: colors.text,
        },

        iconLeft: {
          marginRight: 8,
        },

        iconRight: {
          marginLeft: 8,
        },

        inputHighlighted: {
          borderColor: "#E0B96A",
          borderWidth: 2,
        },

        inputError: {
          borderColor: colors.error,
        },

        errorText: {
          color: colors.error,
          fontSize: 12,
          marginTop: 4,
        },
      }),
    [colors],
  );
}
