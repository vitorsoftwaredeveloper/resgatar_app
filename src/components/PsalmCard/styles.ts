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
          backgroundColor: colors.card,
          borderRadius: RADIUS.md,
          padding: SPACING.md,
          marginBottom: SPACING.md,
          borderWidth: 0.3,
          borderColor: colors.primary,
        },
        labelBadge: {
          paddingVertical: 3,
          borderRadius: 6,
          marginBottom: SPACING.xxs,
        },
        labelRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        label: {
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "800",
          letterSpacing: 0.8,
          color: colors.textMuted,
        },
        referencia: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "700",
          color: colors.primary,
          marginBottom: SPACING.sm2,
        },
        refraoBlock: {
          borderRadius: RADIUS.sm,
          padding: SPACING.sm2,
          marginBottom: SPACING.sm,
          backgroundColor: colors.softBrown,
          borderWidth: 0.2,
          borderColor: colors.primary,
        },
        refraoLabel: {
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "800",
          letterSpacing: 0.6,
          textTransform: "uppercase",
          color: colors.textMuted,
          marginBottom: 4,
        },
        refraoText: {
          fontSize: TYPOGRAPHY.body,
          color: colors.primary,
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
        ttsBtn: {
          width: 28,
          height: 28,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
        },
        ttsBtnActive: {
          backgroundColor: colors.softBrown,
        },
        footer: {
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          marginTop: SPACING.sm,
        },
        toggleText: {
          fontSize: TYPOGRAPHY.body,
          fontWeight: "600",
          color: colors.primary,
        },
      }),
    [colors],
  );
}
