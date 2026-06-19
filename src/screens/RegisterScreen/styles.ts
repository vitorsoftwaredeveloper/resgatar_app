import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        background: {
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          padding: 24,
        },
        card: {
          backgroundColor: colors.card,
          borderRadius: 32,
          paddingHorizontal: 24,
          paddingVertical: 32,
          alignItems: "center",
        },
        logoContainer: {
          width: 120,
          height: 120,
          justifyContent: "center",
          alignItems: "center",
        },
        title: {
          fontSize: 24,
          fontWeight: "700",
          textAlign: "center",
          color: colors.primary,
          marginTop: 16,
          marginBottom: 24,
        },
        form: {
          width: "100%",
          gap: 0,
        },
        row: {
          flexDirection: "row",
          gap: 8,
          width: "100%",
        },
        halfField: {
          flex: 1,
        },
        submitButton: {
          marginTop: 24,
          width: "100%",
        },
        loginLink: {
          marginTop: 16,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        },
        loginLinkText: {
          color: colors.textMuted,
          fontSize: 14,
        },
        loginLinkAction: {
          color: colors.primary,
          fontSize: 14,
          fontWeight: "600",
        },
      }),
    [colors],
  );
}
