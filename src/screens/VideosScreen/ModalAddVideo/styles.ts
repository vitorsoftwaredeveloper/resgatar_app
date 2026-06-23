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
          backgroundColor: colors.background,
        },
        container: {
          backgroundColor: colors.background,
        },
        card: {
          backgroundColor: colors.card,
          borderRadius: RADIUS.md,
          padding: SPACING.md,
          marginBottom: SPACING.md,
        },
        hint: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          marginTop: SPACING.xxs,
          lineHeight: 18,
        },
        previewLabel: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          marginTop: SPACING.md,
          marginBottom: SPACING.xxs,
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        },
        previewLoading: {
          height: 80,
          alignItems: "center",
          justifyContent: "center",
        },
        previewCard: {
          borderRadius: RADIUS.sm,
          overflow: "hidden",
          backgroundColor: colors.softBrown,
        },
        thumbnail: {
          width: "100%",
          aspectRatio: 16 / 9,
          backgroundColor: colors.skeletonBg,
        },
        previewInfo: {
          padding: SPACING.sm,
          gap: 4,
        },
        videoTitle: {
          fontSize: TYPOGRAPHY.body,
          fontWeight: "600",
          color: colors.text,
          lineHeight: 20,
        },
        videoAuthor: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },
        footer: {
          padding: SPACING.md,
          backgroundColor: colors.background,
        },
      }),
    [colors],
  );
}
