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
          backgroundColor: colors.card,
        },
        errorText: {
          fontSize: TYPOGRAPHY.small,
          color: colors.error,
          marginTop: 4,
        },
        footer: {
          padding: SPACING.md,
          backgroundColor: colors.card,
        },
        footerRow: {
          flexDirection: "row",
          gap: SPACING.sm,
        },
        saveFlex: {
          flex: 1.4,
        },
        deleteButton: {
          flex: 1,
          minHeight: 48,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.error,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          paddingHorizontal: SPACING.md,
        },
        deleteText: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "600",
          color: colors.error,
        },

        fieldLabel: {
          fontSize: 13,
          color: colors.muted,
          marginBottom: 6,
        },
        segment: {
          flexDirection: "row",
          borderRadius: RADIUS.lg,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
          marginBottom: SPACING.sm2,
        },
        segmentItem: {
          flex: 1,
          paddingVertical: SPACING.sm2,
          alignItems: "center",
        },
        segmentItemActive: {
          backgroundColor: colors.primary,
        },
        segmentText: {
          fontSize: TYPOGRAPHY.small,
          fontWeight: "600",
          color: colors.text,
        },
        segmentTextActive: {
          color: colors.white,
          fontWeight: "700",
        },
        chipsRow: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: SPACING.xs,
          marginBottom: SPACING.xs,
        },
        chip: {
          paddingHorizontal: SPACING.sm2,
          paddingVertical: SPACING.xs,
          borderRadius: RADIUS.sm,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.inputBg,
        },
        chipActive: {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        },
        chipText: {
          fontSize: TYPOGRAPHY.small,
          fontWeight: "600",
          color: colors.text,
        },
        chipTextActive: {
          color: colors.white,
          fontWeight: "700",
        },

        // Preview da imagem
        previewWrapper: {
          marginHorizontal: SPACING.md,
          marginTop: SPACING.md,
          marginBottom: SPACING.sm2,
          borderRadius: RADIUS.lg,
          overflow: "hidden",
          height: 120,
          backgroundColor: colors.softBrown,
        },
        previewImage: {
          width: "100%",
          height: "100%",
        },
        previewPlaceholder: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          borderWidth: 1.5,
          borderColor: colors.border,
          borderStyle: "dashed",
          borderRadius: RADIUS.lg,
        },
        previewPlaceholderText: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },
        previewEditBadge: {
          position: "absolute",
          bottom: SPACING.sm,
          right: SPACING.sm,
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          backgroundColor: "rgba(0,0,0,0.5)",
          borderRadius: RADIUS.sm,
          paddingHorizontal: SPACING.sm,
          paddingVertical: 4,
        },
        previewEditText: {
          fontSize: TYPOGRAPHY.small,
          fontWeight: "600",
          color: "#FFFFFF",
        },
        fields: {
          paddingHorizontal: SPACING.md,
          gap: SPACING.sm2,
          paddingBottom: SPACING.md,
        },
      }),
    [colors],
  );
}
