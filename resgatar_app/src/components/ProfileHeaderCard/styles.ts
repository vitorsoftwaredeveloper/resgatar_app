import { COLORS, RADIUS, SHADOW, SPACING, TYPOGRAPHY } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOW.card,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.softBrown,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  name: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: "600",
    color: COLORS.textStrong,
  },
  document: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
