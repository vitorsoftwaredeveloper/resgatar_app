import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        safeArea: {
          flex: 1,
        },
        sheet: {
          flex: 1,
          backgroundColor: colors.card,
          borderTopLeftRadius: RADIUS.xl,
          borderTopRightRadius: RADIUS.xl,
          overflow: "hidden",
        },
        header: {
          paddingHorizontal: SPACING.lg,
          paddingTop: SPACING.sm2,
          paddingBottom: SPACING.md,
          gap: SPACING.sm,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
        handle: {
          width: 36,
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.muted,
          alignSelf: "center",
          opacity: 0.4,
        },
        headerRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        headerTitle: {
          color: colors.text,
          fontSize: TYPOGRAPHY.large,
          fontWeight: "600",
        },
        closeButton: {
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: colors.softBrown,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border ?? "#E0E0E0",
        },
      }),
    [colors],
  );
}
