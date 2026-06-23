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
        topBar: {
          height: 44,
          paddingHorizontal: SPACING.xl,
          alignItems: "flex-end",
          justifyContent: "center",
        },
        skip: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          fontWeight: "600",
        },
        slide: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: SPACING.xxl,
        },
        iconWrapper: {
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: colors.softBrown,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: SPACING.xxl,
        },
        phoneFrame: {
          width: 200,
          height: 380,
          borderRadius: RADIUS.xl,
          borderWidth: 8,
          borderColor: colors.primary,
          backgroundColor: colors.card,
          overflow: "hidden",
          marginBottom: SPACING.xxl,
          ...SHADOW.card,
        },
        phoneImage: {
          width: "100%",
          height: "100%",
        },
        title: {
          fontSize: TYPOGRAPHY.hero,
          fontWeight: "700",
          color: colors.textStrong,
          textAlign: "center",
          marginBottom: SPACING.md,
        },
        description: {
          fontSize: TYPOGRAPHY.subtitle,
          color: colors.textMuted,
          textAlign: "center",
          lineHeight: 24,
        },
        footer: {
          paddingHorizontal: SPACING.xl,
          gap: SPACING.xl,
        },
        dots: {
          flexDirection: "row",
          justifyContent: "center",
          gap: SPACING.xs,
        },
        dot: {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.border,
        },
        dotActive: {
          width: 22,
          backgroundColor: colors.primary,
          borderRadius: RADIUS.sm,
        },
      }),
    [colors],
  );
}
