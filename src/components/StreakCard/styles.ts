import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { FONTS } from "@/theme/fonts";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

// Acento dourado da ofensiva — mesmo do resgatar-browser (gold #C9973A).
export const STREAK_ACCENT = "#C9973A";
export const STREAK_ACCENT_DIM = "#C9BCAE";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.card,
          borderRadius: RADIUS.md,
          padding: SPACING.md,
          marginBottom: SPACING.md,
          borderWidth: 1,
          borderColor: colors.border,
        },
        label: {
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "600",
          color: colors.textMuted,
          letterSpacing: 2,
          marginBottom: SPACING.sm2,
        },
        // Card empilhado (browser): flame+número em cima, barras da semana embaixo.
        row: {
          flexDirection: "column",
          alignItems: "stretch",
          gap: 14,
        },
        left: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.sm,
          flexShrink: 1,
        },
        flameWrap: {
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(201,151,58,0.16)",
        },
        flameWrapDim: {
          backgroundColor: colors.softBrown,
        },
        texts: {
          flexShrink: 1,
        },
        headline: {
          fontFamily: FONTS.displaySemiBold,
          fontSize: 22,
          color: colors.text,
          fontVariant: ["lining-nums"],
        },
        subtitle: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          marginTop: 2,
        },
        right: {
          width: "100%",
        },
        week: {
          flexDirection: "row",
          gap: 10,
          width: "100%",
        },
        // Cada dia é uma coluna com a barra em cima e a inicial embaixo.
        dayCol: {
          flex: 1,
          alignItems: "center",
        },
        dayInitial: {
          fontSize: 10.5,
          letterSpacing: 0.5,
          color: colors.textMuted,
        },
        dot: {
          width: "100%",
          height: 8,
          borderRadius: 999,
          marginBottom: 6,
          backgroundColor: colors.border,
        },
        dotRead: {
          backgroundColor: STREAK_ACCENT,
        },
        dotToday: {
          backgroundColor: "transparent",
          borderWidth: 1.5,
          borderColor: STREAK_ACCENT,
        },
      }),
    [colors],
  );
}
