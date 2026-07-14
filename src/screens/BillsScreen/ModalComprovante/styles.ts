import { useAppTheme } from "@/context/ThemeContext";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

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
          paddingHorizontal: 16,
        },
        scroll: {
          flex: 1,
        },
        header: {
          alignItems: "center",
          marginBottom: 20,
        },
        logo: {
          width: 150,
          height: 150,
          borderRadius: 32,
          marginBottom: 10,
        },
        orgName: {
          fontSize: 18,
          fontWeight: "700",
          color: colors.primary,
          marginBottom: 2,
        },
        subtitle: {
          fontSize: 11,
          color: colors.muted,
          letterSpacing: 1,
          textTransform: "uppercase",
        },
        badge: {
          backgroundColor: colors.successBackground,
          borderRadius: 20,
          paddingVertical: 6,
          paddingHorizontal: 14,
          marginTop: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        },
        badgeText: {
          color: colors.success,
          fontSize: 12,
          fontWeight: "700",
        },
        card: {
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: colors.border,
        },
        cardTitle: {
          fontSize: 10,
          color: colors.muted,
          letterSpacing: 1,
          textTransform: "uppercase",
          marginBottom: 12,
        },
        row: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        rowLast: {
          borderBottomWidth: 0,
        },
        rowLabel: {
          fontSize: 12,
          color: colors.muted,
        },
        rowValue: {
          fontSize: 12,
          fontWeight: "600",
          color: colors.text,
          maxWidth: "60%",
          textAlign: "right",
        },
        totalCard: {
          backgroundColor: colors.successBackground,
          borderRadius: 16,
          padding: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        },
        totalLabel: {
          fontSize: 14,
          color: colors.success,
        },
        totalValue: {
          fontSize: 24,
          fontWeight: "700",
          color: colors.success,
        },
        actionsContainer: {
          paddingHorizontal: 16,
        },
      }),
    [colors],
  );
}
