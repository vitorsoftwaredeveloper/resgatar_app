import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        },
        container: {
          width: "100%",
          maxWidth: 420,
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 20,
        },
        title: {
          fontSize: 20,
          fontWeight: "600",
          marginBottom: 20,
          color: colors.text,
        },
        description: {
          fontSize: 16,
          color: colors.primary,
          marginBottom: 20,
          lineHeight: 20,
        },
        actions: {
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: 12,
        },
        button: {
          paddingVertical: 10,
          paddingHorizontal: 18,
          borderRadius: 12,
          width: 110,
        },
        primaryButton: {
          backgroundColor: colors.primary,
        },
        secondaryButton: {
          backgroundColor: colors.muted,
        },
        buttonText: {
          color: colors.white,
          fontWeight: "500",
        },
        secondaryButtonText: {
          color: colors.text,
        },
      }),
    [colors],
  );
}
