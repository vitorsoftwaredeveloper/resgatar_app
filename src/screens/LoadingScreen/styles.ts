import { useAppTheme } from "@/context/ThemeContext";
import { SPACING } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        content: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: SPACING.xl,
        },
        logoContainer: {
          width: 160,
          height: 160,
          justifyContent: "center",
          alignItems: "center",
        },
        loader: {
          marginBottom: SPACING.md,
          position: "absolute",
        },
      }),
    [colors],
  );
}
