import { useAppTheme } from "@/context/ThemeContext";
import { SPACING, TYPOGRAPHY } from "@/theme";
import { FONTS } from "@/theme/fonts";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

// Cabeçalho editorial das telas do Administrativo — espelha o browser:
// eyebrow "Administrativo" (versalete) + título serifado (Cormorant), no lugar
// do antigo título em caixa alta pequeno.
export function AdminScreenTitle({ title }: { title: string }) {
  const { colors } = useAppTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          paddingHorizontal: SPACING.md,
          paddingTop: SPACING.md,
          paddingBottom: SPACING.xs,
        },
        eyebrow: {
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "700",
          letterSpacing: 1,
          textTransform: "uppercase",
          color: colors.gold,
          marginBottom: 4,
        },
        title: {
          fontFamily: FONTS.displaySemiBold,
          fontSize: 28,
          color: colors.text,
          lineHeight: 32,
        },
      }),
    [colors],
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.eyebrow}>Administrativo</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
