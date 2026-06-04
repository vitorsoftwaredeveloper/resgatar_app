import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";

export const typeColors = {
  info: {
    background: "#EDF3FF",
    border: "#AFC6FF",
    text: "#3B6DF6",
  },

  alert: {
    background: "#FDECEC",
    border: "#F5B7B1",
    text: "#C0392B",
  },

  warning: {
    background: "#FFF6E5",
    border: "#FFD591",
    text: "#E6A23C",
  },
};

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        typeButton: {
          flex: 1,
          paddingVertical: 14,
          borderRadius: 16,
          backgroundColor: colors.softBrown,
          alignItems: "center",
          justifyContent: "center",
        },

        typeButtonText: {
          fontSize: 13,
          color: colors.muted,
        },
      }),
    [colors],
  );
}
