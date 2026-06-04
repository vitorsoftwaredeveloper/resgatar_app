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
          backgroundColor: "#00000055",
        },
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        list: {
          marginTop: 8,
        },
        listContent: {
          gap: 12,
        },

        label: {
          marginTop: 16,
          fontSize: 13,
          color: colors.muted,
          marginBottom: 6,
        },

        textArea: {
          height: 100,
          textAlignVertical: "top",
        },

        typeRow: {
          flexDirection: "row",
          gap: 12,
        },
        footer: {
          padding: 16,
          backgroundColor: colors.background,
        },

        containerInput: {
          height: 180,
          marginBottom: 12,
          gap: 24,
        },
      }),
    [colors],
  );
}
