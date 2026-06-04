import { COLORS, RADIUS, SPACING } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.skeletonBg,
  },
  texts: {
    gap: SPACING.xxs,
  },
  lineLarge: {
    width: 120,
    height: 14,
    borderRadius: 8,
    backgroundColor: COLORS.skeletonBg,
  },
  lineSmall: {
    width: 160,
    height: 12,
    borderRadius: 8,
    backgroundColor: COLORS.skeletonBg,
  },
  action: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.skeletonBg,
  },
});
