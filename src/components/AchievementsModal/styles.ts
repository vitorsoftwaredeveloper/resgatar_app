import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SHADOW, SPACING, TYPOGRAPHY } from "@/theme";
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
          backgroundColor: "rgba(0,0,0,0.5)",
        },
        // Altura fixa: a folha não "pula" conforme o conteúdo de cada aba; o
        // miolo rola dentro dela.
        sheet: {
          height: "85%",
          backgroundColor: colors.card,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingHorizontal: SPACING.lg,
          paddingTop: SPACING.sm2,
        },
        scroll: {
          flex: 1,
        },
        handle: {
          width: 40,
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
          fontSize: TYPOGRAPHY.large,
          fontWeight: "700",
          color: colors.text,
          letterSpacing: 0.2,
        },
        close: {
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: colors.background,
          textAlign: "center",
          lineHeight: 30,
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          overflow: "hidden",
        },

        // Segmented control em "track" único, com o item ativo elevado.
        tabsRow: {
          flexDirection: "row",
          backgroundColor: colors.background,
          borderRadius: RADIUS.md,
          padding: 4,
          marginBottom: SPACING.md,
        },
        tabItem: {
          flex: 1,
          paddingVertical: SPACING.xs,
          borderRadius: RADIUS.sm,
          alignItems: "center",
        },
        tabItemOn: {
          backgroundColor: colors.card,
          ...SHADOW.card,
        },
        tabLabel: {
          fontSize: TYPOGRAPHY.small,
          fontWeight: "600",
          color: colors.textMuted,
        },
        tabLabelOn: {
          color: colors.text,
        },

        content: {
          gap: SPACING.md,
          paddingTop: SPACING.xs,
          paddingBottom: SPACING.lg,
        },

        graceCard: {
          flexDirection: "row",
          gap: SPACING.sm,
          backgroundColor: colors.background,
          borderRadius: RADIUS.md,
          padding: SPACING.md,
        },
        graceIcon: {
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: colors.softBrown,
          alignItems: "center",
          justifyContent: "center",
        },
        graceBody: {
          flex: 1,
        },
        graceHeaderRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        graceTitle: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "700",
          color: colors.text,
        },
        graceCount: {
          fontSize: TYPOGRAPHY.body,
          fontWeight: "700",
          color: STREAK_ACCENT,
        },
        gracePips: {
          flexDirection: "row",
          gap: 6,
          marginTop: 8,
          marginBottom: 8,
        },
        gracePip: {
          flex: 1,
          height: 6,
          borderRadius: 3,
          backgroundColor: colors.border,
        },
        gracePipOn: {
          backgroundColor: STREAK_ACCENT,
        },
        graceText: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          lineHeight: TYPOGRAPHY.small * 1.5,
        },

        sectionHeader: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        sectionTitle: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "700",
          color: colors.text,
          letterSpacing: 0.2,
        },
        sectionCount: {
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "700",
          color: STREAK_ACCENT,
          backgroundColor: colors.softBrown,
          paddingHorizontal: SPACING.xs,
          paddingVertical: 2,
          borderRadius: 999,
          overflow: "hidden",
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
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
        badgeUnlocked: {
          borderColor: STREAK_ACCENT,
        },
        badgeLocked: {
          opacity: 0.5,
        },

        badgeIconWrap: {
          width: 46,
          height: 46,
          borderRadius: 23,
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
          lineHeight: TYPOGRAPHY.xsmall * 1.35,
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

        seloHint: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          lineHeight: TYPOGRAPHY.small * 1.45,
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
          gap: 6,
          backgroundColor: colors.background,
          borderRadius: RADIUS.md,
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.xs,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
        frameCardOn: {
          borderWidth: 1.5,
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
          zIndex: 1,
        },
      }),
    [colors],
  );
}
