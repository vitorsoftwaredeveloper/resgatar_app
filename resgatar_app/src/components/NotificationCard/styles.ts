import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    alignItems: "flex-start",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  info: {
    borderLeftColor: COLORS.info,
  },
  alert: {
    borderLeftColor: COLORS.error,
  },
  warning: {
    borderLeftColor: COLORS.waiting,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm2,
  },
  infoIcon: {
    backgroundColor: "#F0F4F8",
  },
  alertIcon: {
    backgroundColor: "#FDECEC",
  },
  warningIcon: {
    backgroundColor: "#FFF4E8",
  },

  textContainer: {
    flex: 1,
    paddingRight: SPACING.xxs,
  },

  header: {
    marginBottom: SPACING.xs,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: "700",
    color: COLORS.textStrong,
    flex: 1,
    marginRight: SPACING.xxs,
  },

  newBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxs,
    paddingVertical: 4,
    borderRadius: SPACING.sm2,
    gap: 4,
  },
  newText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.xsmall,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  date: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.muted,
    fontWeight: "500",
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.softBrown,
    marginVertical: SPACING.sm2,
  },

  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.sm2,
    paddingVertical: SPACING.xs,
    borderRadius: SPACING.sm2,
    alignSelf: "flex-start",
    marginBottom: SPACING.sm2,
  },
  tagLabel: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
  },
  tagIcon: {
    marginRight: SPACING.xs,
  },

  descriptionPreview: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.body,
    lineHeight: 20,
    marginTop: 4,
  },

  descriptionFull: {
    color: COLORS.textStrong,
    fontSize: TYPOGRAPHY.body,
    lineHeight: 22,
  },

  expandable: {
    overflow: "hidden",
  },

  hiddenMeasure: {
    position: "absolute",
    opacity: 0,
    zIndex: -1,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: SPACING.sm2,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  footerDate: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.muted,
    fontWeight: "500",
  },

  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm2,
    paddingVertical: SPACING.xs,
    borderRadius: SPACING.md,
    backgroundColor: COLORS.softBrown,
  },
  shareText: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.primary,
  },

  toggleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.softBrown,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: SPACING.xxs,
    marginTop: 4,
  },
});
