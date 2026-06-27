import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { STREAK_ACCENT } from "@/components/StreakCard/styles";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.45)",
        },
        sheet: {
          backgroundColor: colors.card,
          borderTopLeftRadius: RADIUS.lg,
          borderTopRightRadius: RADIUS.lg,
          paddingHorizontal: SPACING.md,
          paddingTop: SPACING.sm,
          maxHeight: "85%",
        },
        // flexShrink lets the ScrollView shrink to the sheet's capped height so
        // the content scrolls instead of clipping (RN defaults flexShrink to 0).
        scroll: {
          flexShrink: 1,
        },
        handle: {
          width: 36,
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.border,
          alignSelf: "center",
          marginBottom: SPACING.md,
        },
        header: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xs,
          marginBottom: SPACING.md,
        },
        title: {
          flex: 1,
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "700",
          color: colors.text,
        },
        close: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          paddingHorizontal: SPACING.xs,
        },
        content: {
          gap: SPACING.md,
          paddingBottom: SPACING.sm,
        },
        statsRow: {
          flexDirection: "row",
          gap: SPACING.sm,
        },
        statBox: {
          flex: 1,
          alignItems: "center",
          backgroundColor: colors.background,
          borderRadius: RADIUS.md,
          paddingVertical: SPACING.md,
          borderWidth: 1,
          borderColor: colors.border,
        },
        statValue: {
          fontSize: TYPOGRAPHY.hero,
          fontWeight: "700",
          color: colors.primary,
        },
        statLabel: {
          fontSize: TYPOGRAPHY.xsmall,
          color: colors.textMuted,
          marginTop: 2,
        },
        graceCard: {
          backgroundColor: colors.background,
          borderRadius: RADIUS.md,
          padding: SPACING.md,
          borderWidth: 1,
          borderColor: colors.border,
        },
        graceTitle: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "700",
          color: colors.text,
          marginBottom: SPACING.xs,
        },
        graceText: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          lineHeight: TYPOGRAPHY.small * 1.4,
        },
        sectionHeader: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        sectionTitle: {
          fontSize: TYPOGRAPHY.large,
          fontWeight: "700",
          color: colors.text,
        },
        sectionCount: {
          fontSize: TYPOGRAPHY.body,
          fontWeight: "600",
          color: STREAK_ACCENT,
        },
        grid: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: SPACING.sm,
        },
        badge: {
          width: "31%",
          flexGrow: 1,
          alignItems: "center",
          backgroundColor: colors.background,
          borderRadius: RADIUS.md,
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.xs,
          borderWidth: 1,
          borderColor: colors.border,
        },
        badgeUnlocked: {
          backgroundColor: colors.softBrown,
          borderColor: STREAK_ACCENT,
        },
        badgeLocked: {
          opacity: 0.55,
        },
        frameRow: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: SPACING.sm,
        },
        frameCard: {
          width: "31%",
          flexGrow: 1,
          alignItems: "center",
          gap: 4,
          backgroundColor: colors.background,
          borderRadius: RADIUS.md,
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.xs,
          borderWidth: 1,
          borderColor: colors.border,
        },
        frameCardOn: {
          borderWidth: 2,
          borderColor: STREAK_ACCENT,
          backgroundColor: colors.softBrown,
        },
        frameName: {
          fontSize: TYPOGRAPHY.small,
          fontWeight: "600",
          color: colors.text,
          textAlign: "center",
        },
        seloCheck: {
          position: "absolute",
          top: 6,
          right: 6,
          width: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: STREAK_ACCENT,
          alignItems: "center",
          justifyContent: "center",
        },
        seloHint: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          marginTop: -SPACING.xs,
        },
        badgeIconWrap: {
          width: 48,
          height: 48,
          borderRadius: 24,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.softBrown,
          marginBottom: SPACING.xs,
        },
        badgeIconWrapOn: {
          backgroundColor: colors.card,
        },
        badgeTitle: {
          fontSize: TYPOGRAPHY.small,
          fontWeight: "600",
          color: colors.text,
          textAlign: "center",
        },
        badgeTitleLocked: {
          color: colors.textMuted,
        },
        badgeDesc: {
          fontSize: TYPOGRAPHY.xsmall,
          color: colors.textMuted,
          textAlign: "center",
          marginTop: 2,
        },
        progressTrack: {
          width: "100%",
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.border,
          marginTop: SPACING.xs,
          overflow: "hidden",
        },
        progressFill: {
          height: "100%",
          borderRadius: 2,
          backgroundColor: STREAK_ACCENT,
        },
        badgeProgress: {
          fontSize: TYPOGRAPHY.xsmall,
          color: colors.textMuted,
          marginTop: 4,
        },
      }),
    [colors],
  );
}
