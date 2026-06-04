import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SHADOW, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.card,
          borderRadius: RADIUS.md,
          borderLeftWidth: 4,
          padding: SPACING.md,
          marginBottom: SPACING.md,
          ...SHADOW.card,
        },
        gospelCard: {
          borderLeftWidth: 6,
          paddingVertical: SPACING.lg,
        },
        labelBadge: {
          alignSelf: "flex-start",
          paddingHorizontal: SPACING.xxs,
          paddingVertical: 3,
          borderRadius: 6,
          marginBottom: SPACING.xxs,
        },
        label: {
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "800",
          letterSpacing: 0.8,
        },
        referencia: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "700",
          color: colors.textStrong,
          marginBottom: 4,
        },
        titulo: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          fontStyle: "italic",
          marginBottom: SPACING.sm,
        },
        texto: {
          fontSize: TYPOGRAPHY.body,
          color: colors.text,
          lineHeight: 26,
          paddingTop: SPACING.sm,
          paddingBottom: SPACING.sm,
        },
        hiddenMeasure: {
          position: "absolute",
          opacity: 0,
          zIndex: -1,
        },
        footer: {
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          marginTop: SPACING.sm,
        },
        toggleText: {
          fontSize: TYPOGRAPHY.small,
          fontWeight: "600",
        },
        verseNumber: {
          fontSize: TYPOGRAPHY.xsmall,
          color: colors.textMuted,
          fontWeight: "600",
          lineHeight: 26,
        },
      }),
    [colors],
  );
}
