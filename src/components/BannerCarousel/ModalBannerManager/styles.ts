import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export const RAIL_WIDTH = 36;

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.card,
        },

        // --- Intro: mesmo padrão do NoticeBoardScreen ---
        intro: {
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
          paddingHorizontal: SPACING.lg,
          paddingTop: SPACING.md,
          paddingBottom: SPACING.sm,
          gap: SPACING.sm,
        },
        introText: {
          flex: 1,
        },
        eyebrow: {
          fontSize: TYPOGRAPHY.xsmall,
          letterSpacing: 2,
          fontWeight: "700",
          color: colors.textMuted,
          textTransform: "uppercase",
        },
        subtitle: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          marginTop: 2,
        },
        editToggle: {
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          paddingHorizontal: SPACING.sm2,
          height: 38,
          borderRadius: RADIUS.lg,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.card,
        },
        editToggleActive: {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        },
        editToggleText: {
          fontSize: TYPOGRAPHY.small,
          fontWeight: "700",
          color: colors.text,
        },
        editToggleTextActive: {
          color: colors.white,
        },

        // --- Hint: mesmo padrão do NoticeBoardScreen ---
        hint: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xs,
          marginHorizontal: SPACING.lg,
          marginBottom: SPACING.sm,
          paddingVertical: SPACING.xs,
          paddingHorizontal: SPACING.sm2,
          borderRadius: RADIUS.sm,
          backgroundColor: colors.inputBg,
          borderWidth: 1,
          borderColor: colors.border,
        },
        hintText: {
          flex: 1,
          fontSize: TYPOGRAPHY.xsmall,
          color: colors.textMuted,
        },

        list: {
          paddingHorizontal: SPACING.lg,
          paddingTop: SPACING.xs,
          paddingBottom: 100,
        },

        // --- Rail: fio + nó (idêntico ao NoticeBoardScreen) ---
        row: {
          flexDirection: "row",
          paddingBottom: SPACING.md,
        },
        rail: {
          width: RAIL_WIDTH,
          alignItems: "center",
        },
        threadDashed: {
          position: "absolute",
          top: 0,
          bottom: 0,
          borderLeftWidth: 2,
          borderStyle: "dashed",
          borderColor: colors.primary,
        },
        nodeEdit: {
          position: "absolute",
          top: 12,
          width: 26,
          height: 26,
          borderRadius: 13,
          backgroundColor: colors.primary,
          borderWidth: 3,
          borderColor: colors.card,
          alignItems: "center",
          justifyContent: "center",
        },
        nodeNumber: {
          color: colors.white,
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "800",
        },

        // --- Card: idêntico ao NoticeBoardScreen ---
        card: {
          flex: 1,
          backgroundColor: colors.card,
          borderRadius: RADIUS.md,
          borderWidth: 1,
          borderColor: colors.border,
          marginLeft: SPACING.xs,
          overflow: "hidden",
          flexDirection: "row",
          alignItems: "center",
        },
        cardActive: {
          borderColor: colors.primary,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.18,
          shadowRadius: 12,
          elevation: 8,
        },
        thumb: {
          width: 72,
          height: 56,
          backgroundColor: colors.softBrown,
        },
        cardBody: {
          flex: 1,
          paddingHorizontal: SPACING.sm2,
          paddingVertical: SPACING.sm2,
          gap: 2,
        },
        cardTitle: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "700",
          color: colors.textStrong,
        },
        cardMeta: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },
        grip: {
          width: RAIL_WIDTH,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "stretch",
          borderLeftWidth: 1,
          borderColor: colors.border,
        },

        // --- Estado vazio ---
        centered: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: SPACING.xs,
          paddingHorizontal: SPACING.xl,
          paddingBottom: 60,
        },
        emptyTitle: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "700",
          color: colors.text,
        },
        emptyText: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          textAlign: "center",
        },

        // --- FAB: idêntico ao NoticeBoardScreen ---
        fab: {
          position: "absolute",
          right: SPACING.lg,
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
