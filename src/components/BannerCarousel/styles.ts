import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { Dimensions, StyleSheet } from "react-native";

// O content do DashboardScreen já tem paddingHorizontal: SPACING.lg em cada lado.
// O BANNER_WIDTH desconta esse padding para o slide preencher exatamente a área disponível.
export const BANNER_WIDTH = Dimensions.get("window").width - SPACING.lg * 2;
export const BANNER_HEIGHT = 160;

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          marginBottom: SPACING.md,
        },
        scroll: {
          borderRadius: RADIUS.lg,
          overflow: "hidden",
        },
        slide: {
          width: BANNER_WIDTH,
          height: BANNER_HEIGHT,
          borderRadius: RADIUS.lg,
          overflow: "hidden",
          backgroundColor: colors.softBrown,
        },
        image: {
          width: "100%",
          height: "100%",
        },

        // Botão de gerenciar (admin)
        manageButton: {
          position: "absolute",
          top: SPACING.sm,
          right: SPACING.sm,
          backgroundColor: "rgba(0,0,0,0.45)",
          borderRadius: RADIUS.sm,
          paddingHorizontal: SPACING.sm,
          paddingVertical: 5,
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
        },
        manageButtonText: {
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "700",
          color: "#FFFFFF",
          letterSpacing: 0.3,
        },

        // Pontos de paginação
        dots: {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 5,
          marginTop: SPACING.sm,
        },
        dot: {
          width: 5,
          height: 5,
          borderRadius: 3,
          backgroundColor: colors.border,
        },
        dotActive: {
          width: 14,
          backgroundColor: colors.primary,
        },

        // Esqueleto
        skeleton: {
          width: BANNER_WIDTH,
          height: BANNER_HEIGHT,
          borderRadius: RADIUS.lg,
          backgroundColor: colors.skeletonBg,
        },

        // Estado vazio (só visível para admin)
        empty: {
          width: BANNER_WIDTH,
          height: BANNER_HEIGHT,
          borderRadius: RADIUS.lg,
          borderWidth: 1.5,
          borderColor: colors.border,
          borderStyle: "dashed",
          alignItems: "center",
          justifyContent: "center",
          gap: SPACING.xs,
        },
        emptyText: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },
      }),
    [colors],
  );
}
