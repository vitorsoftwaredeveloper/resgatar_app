import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

const ITEM_WIDTH = 132;

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.card,
          borderRadius: RADIUS.md,
          paddingHorizontal: SPACING.md,
          marginBottom: SPACING.md,
          borderWidth: 1,
          borderColor: colors.border,
        },
        header: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: SPACING.sm,
          paddingVertical: SPACING.sm2,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTitle: {
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "600",
          color: colors.textMuted,
          letterSpacing: 0.8,
          textTransform: "uppercase",
        },
        list: {
          gap: SPACING.sm,
          paddingVertical: SPACING.sm2,
        },
        item: {
          width: ITEM_WIDTH,
        },
        thumbWrapper: {
          borderRadius: RADIUS.sm,
          overflow: "hidden",
          position: "relative",
        },
        thumb: {
          width: ITEM_WIDTH,
          aspectRatio: 16 / 9,
          backgroundColor: colors.skeletonBg,
        },
        playIcon: {
          position: "absolute",
          top: "50%",
          left: "50%",
          marginTop: -14,
          marginLeft: -14,
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: "rgba(0, 0, 0, 0.55)",
          alignItems: "center",
          justifyContent: "center",
        },
        itemInfo: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xs,
          marginTop: SPACING.xs,
        },
        itemTexts: {
          flexShrink: 1,
        },
        itemTitle: {
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "600",
          color: colors.text,
        },
        itemAuthor: {
          fontSize: TYPOGRAPHY.xsmall,
          color: colors.textMuted,
        },
        emptyState: {
          alignItems: "center",
          justifyContent: "center",
          gap: SPACING.xs,
          paddingVertical: SPACING.xl,
          marginVertical: SPACING.sm2,
          borderWidth: 1.5,
          borderStyle: "dashed",
          borderColor: colors.border,
          borderRadius: RADIUS.md,
        },
        emptyText: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },
        skeletonThumb: {
          width: ITEM_WIDTH,
          aspectRatio: 16 / 9,
          borderRadius: RADIUS.sm,
          backgroundColor: colors.skeletonBg,
        },
      }),
    [colors],
  );
}
