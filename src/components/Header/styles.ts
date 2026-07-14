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
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: colors.background,
          paddingBottom: 0,
          paddingTop: SPACING.xxl,
          zIndex: 100,
          overflow: "visible",
        },
        left: {
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
          padding: SPACING.lg,
        },
        textContainer: {
          flex: 1,
        },
        backButton: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.softBrown,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
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
        badge: {
          position: "absolute",
          top: -4,
          right: -4,
          minWidth: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: "#E53935",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 3,
        },
        badgeText: {
          color: "#fff",
          fontSize: 9,
          fontWeight: "700",
          lineHeight: 12,
        },
      }),
    [colors],
  );
}
