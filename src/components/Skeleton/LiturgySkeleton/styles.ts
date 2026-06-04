import { COLORS, RADIUS, SPACING } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  banner: {
    height: 64,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.skeletonBg,
    marginBottom: SPACING.md,
  },
  card: {
    height: 96,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.skeletonBg,
    marginBottom: SPACING.md,
  },
  cardSmall: {
    height: 112,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.skeletonBg,
    marginBottom: SPACING.md,
  },
  cardTall: {
    height: 128,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.skeletonBg,
    marginBottom: SPACING.md,
  },
});
