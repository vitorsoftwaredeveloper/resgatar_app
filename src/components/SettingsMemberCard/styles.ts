import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontWeight: "600",
    color: COLORS.textStrong,
    maxWidth: 230,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.textMuted,
    maxWidth: 230,
  },
  delete: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: "#F2DEDA",
    alignItems: "center",
    justifyContent: "center",
  },
  edit: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.background,
    color: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
