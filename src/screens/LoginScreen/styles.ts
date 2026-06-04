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
          backgroundColor: colors.softBrown,
        },
        scrollContent: {
          flexGrow: 1,
          justifyContent: "center",
          padding: 24,
        },

        card: {
          backgroundColor: colors.inputBg,
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
          color: colors.muted,
          marginTop: 32,
        },

        subtitle: {
          textAlign: "center",
          fontSize: 16,
          color: colors.muted,
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
          color: colors.muted,
          fontSize: 16,
          fontStyle: "italic",
        },
        divider: {
          flex: 1,
          height: 1,
          backgroundColor: colors.softBrown,
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
