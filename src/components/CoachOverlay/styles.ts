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
          ...StyleSheet.absoluteFillObject,
          zIndex: 1000,
        },
        dimPressable: {
          ...StyleSheet.absoluteFillObject,
        },
        highlight: {
          position: "absolute",
          borderRadius: 14,
          borderWidth: 2,
          borderColor: colors.white,
        },
        balloon: {
          position: "absolute",
          backgroundColor: colors.card,
          borderRadius: RADIUS.md,
          padding: SPACING.md,
          ...SHADOW.card,
        },
        stepCounter: {
          fontSize: TYPOGRAPHY.xsmall,
          color: colors.textMuted,
          fontWeight: "600",
          marginBottom: 4,
        },
        title: {
          fontSize: TYPOGRAPHY.large,
          fontWeight: "700",
          color: colors.textStrong,
          marginBottom: 6,
        },
        text: {
          fontSize: TYPOGRAPHY.body,
          color: colors.text,
          lineHeight: 20,
          marginBottom: SPACING.md,
        },
        actions: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        skip: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          fontWeight: "600",
        },
        rightActions: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.md,
        },
        prev: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          fontWeight: "600",
        },
        nextButton: {
          backgroundColor: colors.primary,
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.xs,
          borderRadius: RADIUS.sm,
        },
        nextLabel: {
          fontSize: TYPOGRAPHY.body,
          fontWeight: "700",
        },
      }),
    [colors],
  );
}
