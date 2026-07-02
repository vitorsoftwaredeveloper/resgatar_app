import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
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
        content: {
          flex: 1,
          backgroundColor: colors.softBrown,
          borderTopLeftRadius: RADIUS.xl,
          borderTopRightRadius: RADIUS.xl,
          overflow: "hidden",
        },
        searchBar: {
          paddingHorizontal: SPACING.md,
          paddingTop: SPACING.md,
        },
        searchButton: {
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
        },
        body: {
          flex: 1,
        },
        list: {
          padding: SPACING.md,
          gap: SPACING.md,
        },
        videoCard: {
          backgroundColor: colors.card,
          borderRadius: RADIUS.md,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
        },
        playIcon: {
          position: "absolute",
          top: "50%",
          left: "50%",
          marginTop: -20,
          marginLeft: -20,
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "rgba(0,0,0,0.55)",
          alignItems: "center",
          justifyContent: "center",
        },
        videoCardInfo: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.sm,
          padding: SPACING.sm,
        },
        videoCardText: {
          flex: 1,
          gap: 2,
        },
        videoTitle: {
          fontSize: TYPOGRAPHY.body,
          color: colors.text,
          fontWeight: "600",
          lineHeight: 20,
        },
        videoAuthor: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          fontWeight: "400",
        },
        centered: {
          flex: 1,
          alignItems: "center",
          paddingHorizontal: SPACING.xxl,
          paddingTop: SPACING.xxl * 2,
        },
        emptyIconWrap: {
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: SPACING.lg,
        },
        emptyTitle: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "700",
          color: colors.text,
          textAlign: "center",
          marginBottom: SPACING.xs,
        },
        emptyText: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          textAlign: "center",
          lineHeight: 20,
        },
        clearFiltersButton: {
          marginTop: SPACING.lg,
          paddingVertical: SPACING.xs,
          paddingHorizontal: SPACING.md,
          borderRadius: RADIUS.sm,
          borderWidth: 1,
          borderColor: colors.border,
        },
        clearFiltersText: {
          fontSize: TYPOGRAPHY.small,
          fontWeight: "600",
          color: colors.primary,
        },
        memberFilterWrapper: {
          height: 92,
          justifyContent: "center",
        },
        memberArrow: {
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 36,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.softBrown,
        },
        memberArrowLeft: {
          left: 0,
        },
        memberArrowRight: {
          right: 0,
        },
        memberFilterRow: {
          paddingHorizontal: SPACING.md,
          gap: SPACING.xxs,
          alignItems: "center",
        },
        memberItem: {
          alignItems: "center",
          gap: 5,
        },
        memberRing: {
          padding: 2,
          borderRadius: 999,
          backgroundColor: colors.border,
        },
        memberRingActive: {
          backgroundColor: colors.primary,
        },
        memberRingInner: {
          padding: 2,
          borderRadius: 999,
          backgroundColor: colors.softBrown,
        },
        memberName: {
          fontSize: TYPOGRAPHY.xsmall,
          color: colors.textMuted,
          maxWidth: 58,
          textAlign: "center",
        },
        memberNameActive: {
          color: colors.text,
          fontWeight: "500",
        },
        fab: {
          position: "absolute",
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
          elevation: 6,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
        },
      }),
    [colors],
  );
}
