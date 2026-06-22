import { useAppTheme } from "@/context/ThemeContext";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        circle: {
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
          overflow: "hidden",
        },
        image: {
          resizeMode: "cover",
        },
        badge: {
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: colors.primary,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 2,
          borderColor: colors.card,
        },
      }),
    [colors],
  );
}
