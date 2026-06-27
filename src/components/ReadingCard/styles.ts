import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        cardHeader: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: SPACING.xs,
        },
        card: {
          backgroundColor: colors.card,
          borderRadius: RADIUS.md,
          borderWidth: 0.3,
          borderColor: colors.primary,
          padding: SPACING.md,
          marginBottom: SPACING.md,
        },
        label: {
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "700",
          letterSpacing: 0.8,
          color: colors.textMuted,
        },
        referencia: {
          fontSize: TYPOGRAPHY.large,
          fontWeight: "700",
          color: colors.primary,
          marginBottom: 4,
        },
        titulo: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          fontStyle: "italic",
          marginBottom: SPACING.sm,
        },
        toggleRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          marginTop: SPACING.xs,
          marginBottom: 2,
        },
        toggleText: {
          fontSize: TYPOGRAPHY.body,
          fontWeight: "600",
          color: colors.primary,
        },
        texto: {
          fontSize: TYPOGRAPHY.body,
          color: colors.text,
          lineHeight: 26,
          paddingTop: SPACING.sm,
          paddingBottom: SPACING.xs,
        },
        formulaFinal: {
          fontSize: TYPOGRAPHY.body,
          fontStyle: "italic",
          marginTop: SPACING.sm,
          marginBottom: SPACING.xs,
          color: colors.textMuted,
          fontWeight: "600",
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
