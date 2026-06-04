import { SPACING } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 0,
        },
        left: {
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
          backgroundColor: colors.headerGlass,
          padding: SPACING.lg,
          borderTopEndRadius: 0,
          borderTopStartRadius: 0,
          borderBottomStartRadius: 16,
          borderBottomEndRadius: 16,
        },
        textContainer: {
          flex: 1,
        },
        logo: {
          width: 50,
          height: 50,
          marginRight: 12,
          justifyContent: "center",
          alignItems: "center",
        },
        hello: {
          color: colors.primary,
          fontSize: 14,
        },
        name: {
          color: colors.primary,
          fontSize: 18,
          fontWeight: "600",
          flexShrink: 1,
        },
        themeToggle: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.softBrown,
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 8,
        },
      }),
    [colors],
  );
}
