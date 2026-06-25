import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        overlayBackdrop: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        dropdown: {
          position: "absolute",
          backgroundColor: colors.card,
          borderRadius: RADIUS.md,
          minWidth: 200,
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8,
          zIndex: 999,
          overflow: "hidden",
        },
        item: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.sm,
          paddingVertical: SPACING.sm2,
          paddingHorizontal: SPACING.md,
        },
        itemIcon: {
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: colors.softBrown,
          alignItems: "center",
          justifyContent: "center",
        },
        itemLabel: {
          fontSize: TYPOGRAPHY.body,
          color: colors.text,
          fontWeight: "500",
        },
        divider: {
          height: 1,
          backgroundColor: colors.border,
          marginHorizontal: SPACING.md,
        },
        badge: {
          minWidth: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: "#E53935",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 4,
          marginLeft: 8,
        },
        badgeText: {
          color: "#fff",
          fontSize: 10,
          fontWeight: "700",
          lineHeight: 14,
        },
      }),
    [colors],
  );
}
