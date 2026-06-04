import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          height: "100%",
          backgroundColor: colors.softBrown,
        },

        amountContainer: {
          alignItems: "center",
          marginBottom: SPACING.xl,
        },

        amountLabel: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          marginBottom: 4,
        },

        amount: {
          fontSize: 36,
          fontWeight: "700",
          color: colors.text,
        },

        qrContainer: {
          alignItems: "center",
          marginBottom: SPACING.md,
        },

        qrBox: {
          padding: SPACING.lg,
          borderRadius: RADIUS.lg,
          borderWidth: 2,
          borderStyle: "dashed",
          borderColor: colors.border,
          backgroundColor: colors.white,
        },

        helperText: {
          textAlign: "center",
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          marginBottom: SPACING.md,
        },

        pixCodeContainer: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.border,
          borderRadius: SPACING.md,
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.md,
          marginBottom: SPACING.md,
          marginHorizontal: 48,
        },

        pixCode: {
          flex: 1,
          fontSize: TYPOGRAPHY.body,
          color: colors.text,
        },

        copyButton: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.primary,
          justifyContent: "center",
          alignItems: "center",
          marginLeft: SPACING.sm2,
        },

        infoBox: {
          backgroundColor: colors.muted,
          borderRadius: SPACING.md,
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.md,
          marginBottom: SPACING.md,
          marginHorizontal: 48,
        },

        infoText: {
          fontSize: TYPOGRAPHY.small,
          color: colors.white,
          textAlign: "center",
          lineHeight: 18,
        },

        badge: {
          alignSelf: "center",
          backgroundColor: colors.waiting,
          paddingHorizontal: 14,
          paddingVertical: SPACING.xs,
          borderRadius: SPACING.lg,
          marginBottom: SPACING.md,
          marginTop: SPACING.md,
        },

        badgeText: {
          fontSize: TYPOGRAPHY.subtitle,
          color: colors.white,
          fontWeight: "600",
        },

        badgePaid: {
          backgroundColor: colors.successBackground,
        },

        badgePaidText: {
          color: colors.success,
          fontWeight: "700",
          alignSelf: "center",
          borderRadius: SPACING.lg,
          fontSize: TYPOGRAPHY.subtitle,
        },

        containerCopy: {
          alignItems: "center",
          justifyContent: "center",
        },

        tooltipContainer: {
          position: "absolute",
          bottom: 42,
          alignItems: "center",
          width: 70,
          marginLeft: SPACING.sm2,
        },

        balloon: {
          backgroundColor: colors.primary,
          paddingHorizontal: SPACING.sm,
          paddingVertical: SPACING.xs,
          borderRadius: SPACING.xs,
        },

        balloonText: {
          color: colors.white,
          fontSize: TYPOGRAPHY.small,
          fontWeight: "500",
        },

        arrow: {
          width: 0,
          height: 0,
          borderLeftWidth: 6,
          borderRightWidth: 6,
          borderTopWidth: 6,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: colors.primary,
        },
      }),
    [colors],
  );
}
