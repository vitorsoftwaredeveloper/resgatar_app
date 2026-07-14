import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { FONTS } from "@/theme/fonts";
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
          flex: 1,
        },
        content: {
          paddingLeft: SPACING.lg,
          backgroundColor: colors.softBrown,
          paddingRight: SPACING.lg,
          paddingTop: SPACING.lg,
          borderTopLeftRadius: RADIUS.xl,
          borderTopRightRadius: RADIUS.xl,
          minHeight: "100%",
        },
        errorContainer: {
          alignItems: "center",
          paddingVertical: 56,
          gap: SPACING.sm2,
        },
        errorTitle: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "700",
          color: colors.textStrong,
        },
        errorSubtitle: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          textAlign: "center",
        },
        retryButton: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xxs,
          marginTop: SPACING.sm,
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.sm,
          borderRadius: RADIUS.sm,
          backgroundColor: colors.softBrown,
        },
        retryText: {
          fontSize: TYPOGRAPHY.body,
          color: colors.primary,
          fontWeight: "600",
        },
        ttsIndicator: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xxs,
          alignSelf: "center",
          backgroundColor: colors.softBrown,
          borderRadius: RADIUS.lg,
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.xxs,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: SPACING.xxs,
        },
        ttsIndicatorText: {
          fontSize: TYPOGRAPHY.small,
          color: colors.primary,
          fontWeight: "500",
          flex: 1,
        },
        // Cabeçalho editorial (portado do browser): eyebrow + título + pílula
        // da cor litúrgica, no lugar do antigo LiturgySeasonBanner.
        pageHead: {
          marginBottom: SPACING.md,
        },
        eyebrow: {
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "700",
          letterSpacing: 1,
          textTransform: "uppercase",
          color: colors.gold,
        },
        pageTitle: {
          fontFamily: FONTS.displaySemiBold,
          fontSize: 30,
          color: colors.text,
          lineHeight: 38,
          marginTop: SPACING.xs,
          fontVariant: ["lining-nums"],
        },
        colorPill: {
          flexDirection: "row",
          alignSelf: "flex-start",
          alignItems: "center",
          gap: 7,
          paddingHorizontal: SPACING.sm,
          paddingVertical: 4,
          borderRadius: 999,
          marginTop: SPACING.sm,
        },
        colorDot: {
          width: 7,
          height: 7,
          borderRadius: 3.5,
        },
        colorPillText: {
          fontSize: TYPOGRAPHY.small,
          fontWeight: "700",
          letterSpacing: 0.5,
        },
      }),
    [colors],
  );
}
