import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SHADOW, SPACING, TYPOGRAPHY } from "@/theme";
import { FONTS } from "@/theme/fonts";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        // Painel único do leitor (browser .panel): borda + sombra, o select no
        // topo (dentro de uma faixa com borda inferior) e a leitura abaixo.
        panel: {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: RADIUS.lg,
          overflow: "hidden",
          ...SHADOW.card,
        },
        tabsWrap: {
          padding: SPACING.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        // Seletor de leitura (pílula) — dropdown no topo do painel.
        selectTrigger: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: SPACING.sm,
          paddingVertical: SPACING.sm2,
          paddingHorizontal: SPACING.md,
          backgroundColor: colors.inputBg,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 999,
        },
        selectLabel: {
          fontSize: TYPOGRAPHY.body,
          fontWeight: "600",
          color: colors.text,
        },
        // Overlay do dropdown.
        backdrop: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.35)",
          justifyContent: "center",
          paddingHorizontal: SPACING.lg,
        },
        selectList: {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: RADIUS.lg,
          padding: SPACING.xs,
        },
        selectOption: {
          paddingVertical: SPACING.sm2,
          paddingHorizontal: SPACING.md,
          borderRadius: RADIUS.md,
        },
        selectOptionActive: {
          backgroundColor: colors.primary,
        },
        selectOptionText: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "600",
          color: colors.textMuted,
        },
        selectOptionTextActive: {
          color: colors.white,
        },

        // Leitura ativa — dentro do painel, sem borda própria.
        reading: {
          padding: SPACING.lg,
        },
        readingHeader: {
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: SPACING.md,
        },
        readingHeadings: {
          flexShrink: 1,
        },
        readingLabel: {
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "700",
          letterSpacing: 2,
          textTransform: "uppercase",
          color: colors.gold,
          marginBottom: SPACING.xs,
        },
        referencia: {
          fontFamily: FONTS.displaySemiBold,
          fontSize: 30,
          color: colors.text,
          lineHeight: 34,
        },
        titulo: {
          fontFamily: FONTS.displayMediumItalic,
          fontSize: TYPOGRAPHY.large,
          color: colors.textMuted,
          marginTop: 4,
        },
        ttsBtn: {
          width: 44,
          height: 44,
          borderRadius: RADIUS.md,
          backgroundColor: colors.inputBg,
          alignItems: "center",
          justifyContent: "center",
        },
        ttsBtnActive: {
          backgroundColor: colors.softBrown,
        },
        hairline: {
          height: 1,
          backgroundColor: colors.border,
          marginVertical: SPACING.lg,
        },
        refraoBlock: {
          marginBottom: SPACING.md,
        },
        refraoText: {
          fontFamily: FONTS.displayMediumItalic,
          fontSize: 19,
          color: colors.primary,
        },
        texto: {
          fontFamily: FONTS.displayMedium,
          fontSize: 20,
          color: colors.text,
          lineHeight: 31,
        },
        verseNumber: {
          fontSize: TYPOGRAPHY.small,
          color: colors.gold,
          fontWeight: "700",
        },
        formulaFinal: {
          fontSize: TYPOGRAPHY.body,
          fontStyle: "italic",
          color: colors.textMuted,
          marginTop: SPACING.sm2,
        },
      }),
    [colors],
  );
}
