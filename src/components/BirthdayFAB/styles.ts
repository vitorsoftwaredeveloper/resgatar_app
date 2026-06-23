import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        fab: {
          position: "absolute",
          right: 16,
          width: 52,
          height: 52,
          borderRadius: 26,
          shadowColor: colors.primary,
          shadowOpacity: 0.4,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
        },
        fabInner: {
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
        },
        badge: {
          position: "absolute",
          top: -4,
          right: -4,
          backgroundColor: colors.waiting,
          borderRadius: 999,
          minWidth: 18,
          height: 18,
          paddingHorizontal: 4,
          alignItems: "center",
          justifyContent: "center",
        },
        badgeText: {
          color: colors.white,
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "700",
        },

        // Modal
        modalOverlay: {
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
          maxHeight: "75%",
        },
        sheetHandle: {
          width: 36,
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.border,
          alignSelf: "center",
          marginBottom: SPACING.md,
        },
        sheetHeader: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xs,
          marginBottom: SPACING.md,
        },
        sheetIcon: {
          color: colors.textMuted,
        },
        sheetTitle: {
          flex: 1,
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "700",
          color: colors.text,
        },
        sheetClose: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          paddingHorizontal: SPACING.xs,
        },

        // List items
        listItem: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.md,
          paddingVertical: SPACING.sm2,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        listItemToday: {
          backgroundColor: colors.softBrown,
          borderRadius: RADIUS.sm,
          paddingHorizontal: SPACING.sm,
          borderBottomWidth: 0,
          marginBottom: SPACING.sm2,
        },
        listItemInfo: {
          flex: 1,
          gap: 2,
        },
        listItemName: {
          fontSize: TYPOGRAPHY.body,
          fontWeight: "600",
          color: colors.text,
        },
        listItemNameToday: {
          color: colors.primary,
        },
        listItemDate: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },
        listItemDateToday: {
          color: colors.primary,
          fontWeight: "600",
        },

        // Avatar ring (today)
        avatarRing: {
          borderRadius: 999,
          borderWidth: 2,
          borderColor: colors.primary,
          padding: 2,
          shadowColor: colors.primary,
          shadowOpacity: 0.5,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 0 },
          elevation: 4,
        },
        todayBadge: {
          position: "absolute",
          bottom: -2,
          right: -2,
          backgroundColor: colors.card,
          borderRadius: 999,
          width: 18,
          height: 18,
          alignItems: "center",
          justifyContent: "center",
        },
        todayBadgeText: {
          fontSize: 10,
        },
      }),
    [colors],
  );
}
