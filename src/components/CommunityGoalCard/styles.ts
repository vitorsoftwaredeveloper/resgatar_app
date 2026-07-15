import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: RADIUS.md,
          padding: SPACING.md,
          marginBottom: SPACING.md,
        },
        header: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xxs,
          marginBottom: SPACING.sm2,
        },
        title: {
          fontSize: TYPOGRAPHY.xsmall,
          color: colors.textMuted,
          fontWeight: "600",
          letterSpacing: 0.8,
          textTransform: "uppercase",
        },
        editButton: {
          marginLeft: "auto",
          padding: SPACING.xxs,
        },
        valueRow: {
          flexDirection: "row",
          alignItems: "baseline",
          gap: SPACING.xs,
          marginBottom: SPACING.sm,
        },
        percent: {
          fontSize: TYPOGRAPHY.hero,
          color: colors.success,
          fontWeight: "700",
        },
        caption: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
        },
        track: {
          height: 12,
          borderRadius: 6,
          backgroundColor: colors.softBrown,
          overflow: "hidden",
        },
        fill: {
          height: "100%",
          borderRadius: 6,
          backgroundColor: colors.success,
        },
        // Composição da meta em linhas empilhadas (espelha o browser):
        // mensalidades (base), doações (entram) e despesas (abatem).
        statsList: {
          marginTop: SPACING.md,
          gap: SPACING.sm2,
        },
        statRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        statLeft: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.sm,
        },
        statLabel: {
          fontSize: TYPOGRAPHY.body,
          color: colors.text,
        },
        statValue: {
          fontSize: TYPOGRAPHY.body,
          fontWeight: "700",
          color: colors.text,
        },
        // Caixa destacada (browser): fundo tingido pela faixa + "Faltam R$ X /
        // Meta atingida" + mensagem encorajadora. Sempre visível.
        highlightBox: {
          borderRadius: RADIUS.sm,
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.sm2,
          marginTop: SPACING.sm,
        },
        highlightRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xs,
        },
        highlightText: {
          fontSize: TYPOGRAPHY.small,
          fontWeight: "600",
          color: colors.text,
          flexShrink: 1,
        },
        remainingStrong: {
          fontWeight: "700",
        },
        highlightMessage: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          lineHeight: 17,
          marginTop: 4,
        },
        emptyState: {
          alignItems: "center",
          justifyContent: "center",
          gap: SPACING.xs,
          paddingVertical: SPACING.xl,
          borderWidth: 1.5,
          borderStyle: "dashed",
          borderColor: colors.border,
          borderRadius: RADIUS.md,
        },
        emptyText: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          textAlign: "center",
        },
      }),
    [colors],
  );
}
