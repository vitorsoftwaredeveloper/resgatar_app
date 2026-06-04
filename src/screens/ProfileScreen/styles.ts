import { COLORS, RADIUS, SHADOW, SPACING, TYPOGRAPHY } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    ...SHADOW.card,
  },
  logout: {
    marginTop: SPACING.xxl,
    alignItems: "center",
  },
  logoutText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: "600",
  },
});
