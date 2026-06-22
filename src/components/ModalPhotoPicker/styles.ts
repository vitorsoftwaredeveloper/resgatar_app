import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SHADOW, SPACING, TYPOGRAPHY } from "@/theme";
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
        scroll: {
          padding: SPACING.lg,
        },
        preview: {
          alignItems: "center",
          paddingVertical: SPACING.lg,
        },
        avatarRing: {
          padding: SPACING.xs,
          borderRadius: 999,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          ...SHADOW.card,
        },
        previewHint: {
          marginTop: SPACING.md,
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          fontWeight: "600",
        },
        card: {
          backgroundColor: colors.card,
          borderRadius: RADIUS.md,
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.xs,
          marginTop: SPACING.lg,
          ...SHADOW.card,
        },
        removeButton: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: SPACING.xxs,
          marginTop: SPACING.lg,
          paddingVertical: SPACING.md,
          borderRadius: RADIUS.md,
          backgroundColor: colors.softBrown,
        },
        removeText: {
          color: colors.error,
          fontWeight: "600",
          fontSize: TYPOGRAPHY.body,
        },
        footer: {
          padding: SPACING.lg,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.background,
        },
      }),
    [colors],
  );
}
