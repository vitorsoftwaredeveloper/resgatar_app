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
          backgroundColor: "#00000055",
        },
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },

        card: {
          backgroundColor: colors.card,
          margin: 16,
          padding: 16,
          borderRadius: 24,
        },
        cardTitle: {
          fontSize: 18,
          fontWeight: "700",
          color: colors.text,
          marginBottom: 12,
        },

        inputWrapper: {
          marginBottom: 12,
        },
        inputLabel: {
          fontSize: 13,
          color: colors.muted,
          marginBottom: 6,
        },
        inputBox: {
          backgroundColor: colors.inputBg,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 20,
          paddingVertical: 14,
          paddingHorizontal: 16,
        },
        inputHighlighted: {
          borderColor: "#E0B96A",
          borderWidth: 2,
        },
        inputText: {
          fontSize: 16,
          color: colors.text,
        },

        row: {
          flexDirection: "row",
          gap: 12,
        },

        dateBox: {
          backgroundColor: colors.softBrown,
          borderRadius: 20,
          paddingVertical: 16,
          alignItems: "center",
        },
        dateText: {
          fontSize: 18,
          fontWeight: "700",
          color: colors.text,
        },

        subLabel: {
          fontSize: 14,
          color: colors.muted,
          marginBottom: 8,
        },

        daysGrid: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 16,
        },
        dayCircle: {
          width: 44,
          height: 44,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: "center",
          justifyContent: "center",
        },
        dayCircleActive: {
          backgroundColor: colors.primary,
        },
        dayText: {
          color: colors.text,
          fontWeight: "600",
        },
        dayTextActive: {
          color: "#FFF",
        },

        toggle: {
          flexDirection: "row",
          borderRadius: 24,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
          marginBottom: 12,
        },
        toggleItem: {
          flex: 1,
          paddingVertical: 14,
          alignItems: "center",
        },
        toggleActive: {
          backgroundColor: colors.primary,
        },
        toggleText: {
          color: colors.text,
          fontWeight: "600",
        },
        toggleTextActive: {
          color: "#FFF",
          fontWeight: "700",
        },

        footer: {
          padding: 16,
          backgroundColor: colors.background,
        },
        saveButton: {
          backgroundColor: colors.primary,
          borderRadius: 28,
          paddingVertical: 18,
          alignItems: "center",
        },
        saveText: {
          color: "#FFF",
          fontSize: 18,
          fontWeight: "700",
        },
      }),
    [colors],
  );
}
