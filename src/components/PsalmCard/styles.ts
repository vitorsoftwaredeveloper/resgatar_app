import { RADIUS, SHADOW, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";

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
          marginBottom: SPACING.sm2,
        },
        refraoBlock: {
          borderWidth: 1,
          borderRadius: RADIUS.sm,
          padding: SPACING.sm2,
          marginBottom: SPACING.sm,
        },
        refraoLabel: {
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "800",
          letterSpacing: 0.6,
          textTransform: "uppercase",
          marginBottom: 4,
        },
        refraoText: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textStrong,
          fontStyle: "italic",
          lineHeight: 22,
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
      }),
    [colors],
  );
}
