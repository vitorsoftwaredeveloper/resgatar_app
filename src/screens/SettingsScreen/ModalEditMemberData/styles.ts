import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

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
          marginTop: SPACING.xxs,
        },
        listContent: {
          gap: SPACING.sm2,
        },
        card: {
          marginHorizontal: SPACING.md,
          padding: SPACING.md,
          borderRadius: RADIUS.md,
          backgroundColor: colors.card,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        userInfo: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.sm2,
          flex: 1,
        },
        userName: {
          fontWeight: "600",
          color: colors.textStrong,
          maxWidth: 180,
        },
        userEmail: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          maxWidth: 180,
        },
        action: {
          width: 44,
          height: 44,
          borderRadius: RADIUS.sm,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        },
      }),
    [colors],
  );
}
