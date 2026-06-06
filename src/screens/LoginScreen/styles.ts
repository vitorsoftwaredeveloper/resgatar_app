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
          minHeight: "55%",
          justifyContent: "space-between",
          alignItems: "center",
        },
        title: {
          fontSize: 28,
          fontWeight: "700",
          textAlign: "center",
          color: colors.primary,
          marginTop: 32,
        },
        subtitle: {
          textAlign: "center",
          fontSize: 16,
          color: colors.textMuted,
          marginBottom: 32,
          marginTop: 8,
          fontStyle: "italic",
        },
        submitButton: {
          marginTop: 24,
          width: "100%",
        },
        motion: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        motionText: {
          marginHorizontal: 12,
          color: colors.textMuted,
          fontSize: 16,
          fontStyle: "italic",
        },
        divider: {
          flex: 1,
          height: 1,
          backgroundColor: colors.border,
        },
        logoContainer: {
          width: 160,
          height: 160,
          justifyContent: "center",
          alignItems: "center",
        },
        form: {
          marginBottom: 16,
          minHeight: 120,
          width: "100%",
        },
      }),
    [colors],
  );
}
