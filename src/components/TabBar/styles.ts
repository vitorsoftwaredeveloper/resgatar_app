import { useMemo } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";

const { width } = Dimensions.get("window");

export const TAB_WIDTH = width / 3;

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () => ({
      ACTIVE_COLOR: colors.primary,
      INACTIVE_COLOR: colors.textMuted,
      styles: StyleSheet.create({
        container: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.tabBarBg,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        indicator: {
          position: "absolute",
          top: 0,
          height: 4,
          width: TAB_WIDTH,
          backgroundColor: colors.primary,
        },
        row: {
          flexDirection: "row",
          height: 72,
        },
        tab: {
          width: TAB_WIDTH,
          alignItems: "center",
          justifyContent: "center",
        },
        tabInner: {
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 6,
        },
        label: {
          marginTop: 4,
          fontSize: 12,
        },
      }),
    }),
    [colors],
  );
}
