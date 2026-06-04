import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          flexDirection: "row",
          backgroundColor: colors.card,
          borderRadius: 20,
          padding: SPACING.md,
          marginBottom: SPACING.md,
          borderLeftWidth: 4,
          alignItems: "flex-start",
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        },

        info: {
          borderLeftColor: colors.info,
        },
        alert: {
          borderLeftColor: colors.error,
        },
        warning: {
          borderLeftColor: colors.waiting,
        },

        iconContainer: {
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
          marginRight: SPACING.sm2,
        },
        infoIcon: {
          backgroundColor: "#F0F4F8",
        },
        alertIcon: {
          backgroundColor: "#FDECEC",
        },
        warningIcon: {
          backgroundColor: "#FFF4E8",
        },

        textContainer: {
          flex: 1,
          paddingRight: SPACING.xxs,
        },

        header: {
          marginBottom: SPACING.xs,
        },
        titleRow: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 4,
        },
        title: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "700",
          color: colors.textStrong,
          flex: 1,
          marginRight: SPACING.xxs,
        },

        newBadge: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.primary,
          paddingHorizontal: SPACING.xxs,
          paddingVertical: 4,
          borderRadius: SPACING.sm2,
          gap: 4,
        },
        newText: {
          color: colors.white,
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "700",
          letterSpacing: 0.3,
        },

        date: {
          fontSize: TYPOGRAPHY.small,
          color: colors.muted,
          fontWeight: "500",
        },

        divider: {
          height: 1,
          backgroundColor: colors.softBrown,
          marginVertical: SPACING.sm2,
        },

        tagContainer: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: SPACING.sm2,
          paddingVertical: SPACING.xs,
          borderRadius: SPACING.sm2,
          alignSelf: "flex-start",
          marginBottom: SPACING.sm2,
        },
        tagLabel: {
          fontSize: TYPOGRAPHY.small,
          fontWeight: "600",
        },
        tagIcon: {
          marginRight: SPACING.xs,
        },

        descriptionPreview: {
          color: colors.textMuted,
          fontSize: TYPOGRAPHY.body,
          lineHeight: 20,
          marginTop: 4,
        },

        descriptionFull: {
          color: colors.textStrong,
          fontSize: TYPOGRAPHY.body,
          lineHeight: 22,
        },

        expandable: {
          overflow: "hidden",
        },

        hiddenMeasure: {
          position: "absolute",
          opacity: 0,
          zIndex: -1,
        },

        footer: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: SPACING.sm2,
        },
        footerLeft: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xs,
        },
        footerDate: {
          fontSize: TYPOGRAPHY.small,
          color: colors.muted,
          fontWeight: "500",
        },

        shareButton: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xs,
          paddingHorizontal: SPACING.sm2,
          paddingVertical: SPACING.xs,
          borderRadius: SPACING.md,
          backgroundColor: colors.softBrown,
        },
        shareText: {
          fontSize: TYPOGRAPHY.small,
          fontWeight: "600",
          color: colors.primary,
        },

        toggleButton: {
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: colors.softBrown,
          alignItems: "center",
          justifyContent: "center",
          marginLeft: SPACING.xxs,
          marginTop: 4,
        },
      }),
    [colors],
  );
}
