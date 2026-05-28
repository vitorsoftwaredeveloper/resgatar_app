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
    marginBottom: SPACING.md,
  },

  avisosTitle: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: "700",
    color: COLORS.textStrong,
  },

  badge: {
    backgroundColor: COLORS.softBrown,
    color: COLORS.primary,
    paddingHorizontal: SPACING.sm2,
    paddingVertical: 4,
    borderRadius: SPACING.sm2,
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
  },
});
