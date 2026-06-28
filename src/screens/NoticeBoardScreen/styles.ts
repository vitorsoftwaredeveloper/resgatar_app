import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

// Largura da "calha" à esquerda onde corre o fio do mural e ficam os nós.
export const RAIL_WIDTH = 36;

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

        // Cabeçalho da tela: eyebrow + título + ação de editar (admin).
        intro: {
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
          paddingHorizontal: SPACING.lg,
          paddingTop: SPACING.lg,
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
        title: {
          fontSize: TYPOGRAPHY.title,
          fontWeight: "800",
          color: colors.textStrong,
          marginTop: 2,
        },
        subtitle: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          marginTop: 2,
        },

        // Botão de alternar o modo de edição (somente admin).
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

        // Faixa de instrução exibida durante a edição.
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
          paddingBottom: 120,
        },

        // Uma linha = calha (fio + nó) + cartão. Rows encostam para o fio
        // ficar contínuo; o respiro vem do paddingBottom da própria row.
        row: {
          flexDirection: "row",
          paddingBottom: SPACING.md,
        },
        rail: {
          width: RAIL_WIDTH,
          alignItems: "center",
        },
        threadSolid: {
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 2,
          backgroundColor: colors.border,
          borderRadius: 1,
        },
        threadDashed: {
          position: "absolute",
          top: 0,
          bottom: 0,
          borderLeftWidth: 2,
          borderStyle: "dashed",
          borderColor: colors.primary,
        },
        // Nó na altura do título do cartão. O anel cor-de-fundo "fura" o fio.
        node: {
          position: "absolute",
          top: 20,
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: colors.primary,
          borderWidth: 3,
          borderColor: colors.softBrown,
        },
        nodeEdit: {
          position: "absolute",
          top: 12,
          width: 26,
          height: 26,
          borderRadius: 13,
          backgroundColor: colors.primary,
          borderWidth: 3,
          borderColor: colors.softBrown,
          alignItems: "center",
          justifyContent: "center",
        },
        nodeNumber: {
          color: colors.white,
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "800",
        },
        // Compromisso de hoje: nó "aceso" em âmbar (maior, com anel de fundo).
        nodeToday: {
          position: "absolute",
          top: 18,
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: colors.waiting,
          borderWidth: 3,
          borderColor: colors.softBrown,
        },
        nodeEditToday: {
          backgroundColor: colors.waiting,
        },

        card: {
          flex: 1,
          backgroundColor: colors.card,
          borderRadius: RADIUS.md,
          borderWidth: 1,
          borderColor: colors.border,
          paddingVertical: SPACING.sm2,
          paddingHorizontal: SPACING.sm2,
          marginLeft: SPACING.xs,
        },
        cardEditing: {
          paddingRight: RAIL_WIDTH + SPACING.sm,
        },
        cardToday: {
          borderColor: colors.waiting,
        },
        todayTag: {
          paddingHorizontal: SPACING.xs,
          paddingVertical: 2,
          borderRadius: RADIUS.sm,
          backgroundColor: colors.waiting,
        },
        todayTagText: {
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "800",
          letterSpacing: 0.5,
          color: "#3E2C1C",
        },
        cardActive: {
          borderColor: colors.primary,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.18,
          shadowRadius: 12,
          elevation: 8,
        },
        cardTopRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.sm,
        },
        cardTitle: {
          flex: 1,
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "700",
          color: colors.textStrong,
        },
        timePill: {
          paddingHorizontal: SPACING.sm,
          paddingVertical: 3,
          borderRadius: RADIUS.sm,
          backgroundColor: colors.primary,
        },
        timeText: {
          color: colors.white,
          fontSize: TYPOGRAPHY.small,
          fontWeight: "700",
        },
        cardMetaRow: {
          flexDirection: "row",
          alignItems: "center",
          marginTop: 4,
        },
        cardMeta: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },

        // Alça de arraste: faixa na borda direita do cartão, só na edição.
        grip: {
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: RAIL_WIDTH,
          alignItems: "center",
          justifyContent: "center",
          borderLeftWidth: 1,
          borderColor: colors.border,
        },

        // Estado vazio.
        centered: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: SPACING.xxl,
          paddingTop: SPACING.xxl,
          gap: SPACING.sm,
        },
        emptyTitle: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "700",
          color: colors.text,
          textAlign: "center",
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
