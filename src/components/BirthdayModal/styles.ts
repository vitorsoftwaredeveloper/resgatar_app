import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
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
          maxHeight: "75%",
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
        headerIcon: {
          color: colors.textMuted,
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
        emptyText: {
          textAlign: "center",
          color: colors.textMuted,
          fontSize: TYPOGRAPHY.body,
          paddingVertical: SPACING.xl,
        },
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
