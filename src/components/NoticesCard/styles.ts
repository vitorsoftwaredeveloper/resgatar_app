import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.card,
          borderRadius: RADIUS.md,
          paddingHorizontal: SPACING.md,
          marginBottom: SPACING.md,
          borderWidth: 1,
          borderColor: colors.border,
        },
        row: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.sm,
          paddingVertical: SPACING.sm2,
        },
        rowBorder: {
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        iconWrap: {
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.softBrown,
        },
        texts: {
          flexShrink: 1,
        },
        title: {
          fontSize: TYPOGRAPHY.body,
          fontWeight: "600",
          color: colors.text,
        },
        date: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          marginTop: 2,
        },
      }),
    [colors],
  );
}
