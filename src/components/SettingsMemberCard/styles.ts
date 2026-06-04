import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
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
        },
        avatar: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        },
        userName: {
          fontWeight: "600",
          color: colors.textStrong,
          maxWidth: 230,
        },
        userEmail: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          maxWidth: 230,
        },
        delete: {
          width: 44,
          height: 44,
          borderRadius: RADIUS.sm,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        },
        edit: {
          width: 44,
          height: 44,
          borderRadius: RADIUS.sm,
          backgroundColor: colors.background,
          color: colors.primary,
          alignItems: "center",
          justifyContent: "center",
        },
      }),
    [colors],
  );
}
