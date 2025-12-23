import { COLORS, RADIUS, SPACING } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },

  title: {
    height: 18,
    width: "60%",
    backgroundColor: COLORS.border,
    borderRadius: 6,
    marginBottom: 10,
  },

  line: {
    height: 14,
    width: "100%",
    backgroundColor: COLORS.border,
    borderRadius: 6,
    marginBottom: 8,
  },

  small: {
    height: 12,
    width: "40%",
    backgroundColor: COLORS.border,
    borderRadius: 6,
  },
});
