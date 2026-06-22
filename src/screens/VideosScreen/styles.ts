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
        content: {
          flex: 1,
          backgroundColor: colors.softBrown,
          borderTopLeftRadius: RADIUS.xl,
          borderTopRightRadius: RADIUS.xl,
          overflow: "hidden",
        },
        body: {
          flex: 1,
        },
        list: {
          padding: SPACING.md,
          gap: SPACING.sm,
        },
        skeletonList: {
          paddingVertical: SPACING.md,
          gap: SPACING.sm,
        },
        memberCard: {
          backgroundColor: colors.card,
          borderRadius: RADIUS.md,
          padding: SPACING.md,
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.md,
          ...SHADOW.card,
        },
        memberInfo: {
          flex: 1,
        },
        memberName: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "600",
          color: colors.text,
        },
        videoCount: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          marginTop: 2,
        },
        centered: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: SPACING.xxl,
        },
        emptyText: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          textAlign: "center",
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
