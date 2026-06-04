import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        iconButton: {
          width: 30,
          height: 30,
          borderRadius: 20,
          backgroundColor: colors.mutedBackground,
          alignItems: "center",
          justifyContent: "center",
        },
      }),
    [colors],
  );
}
