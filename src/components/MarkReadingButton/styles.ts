import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export const READING_ACCENT = "#E8862E";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        // estado ativo (ainda não lida) — botão compacto primary
        cta: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: SPACING.xs,
          // alignSelf: "center",
          backgroundColor: colors.primary,
          borderRadius: RADIUS.lg,
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.sm,
          marginBottom: SPACING.sm2,
        },
        ctaTitle: {
          fontSize: TYPOGRAPHY.body,
          fontWeight: "600",
          color: "#FFFFFF",
        },
      }),
    [colors],
  );
}
