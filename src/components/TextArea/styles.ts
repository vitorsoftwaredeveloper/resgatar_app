import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";

const LINE_HEIGHT = 22;
const VERTICAL_PADDING = 14;

export function useStyles(numberOfLines: number) {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          marginBottom: 12,
        },

        label: {
          fontSize: 13,
          color: colors.muted,
          marginBottom: 6,
        },

        container: {
          backgroundColor: colors.inputBg,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 16,
          paddingHorizontal: 14,
          paddingVertical: VERTICAL_PADDING,
          minHeight: numberOfLines * LINE_HEIGHT + VERTICAL_PADDING * 2,
        },

        containerFocused: {
          borderColor: "#E0B96A",
          borderWidth: 2,
        },

        containerError: {
          borderColor: colors.error,
        },

        input: {
          flex: 1,
          color: colors.text,
          fontSize: 14,
          lineHeight: LINE_HEIGHT,
          padding: 0,
          margin: 0,
        },

        errorText: {
          color: colors.error,
          fontSize: 12,
          marginTop: 4,
        },
      }),
    [colors, numberOfLines],
  );
}
