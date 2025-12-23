import { COLORS, SPACING, TYPOGRAPHY } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },

  title: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: SPACING.lg,
  },

  avisosHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  avisosTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3E2C1C",
  },

  badge: {
    backgroundColor: "#EFE6DF",
    color: "#6B4E3D",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 13,
    fontWeight: "600",
  },
});
