import { COLORS } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
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
    marginRight: 12,
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
    paddingRight: 8,
  },

  header: {
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C1810",
    flex: 1,
    marginRight: 8,
  },

  newBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6B4E3D",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  newText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  date: {
    fontSize: 13,
    color: "#9B8678",
    fontWeight: "500",
  },

  divider: {
    height: 1,
    backgroundColor: "#E8DDD4",
    marginVertical: 12,
  },

  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  tagLabel: {
    fontSize: 13,
    fontWeight: "600",
  },

  tagIcon: {
    marginRight: 6,
  },

  descriptionPreview: {
    color: "#7A6A5E",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },

  descriptionFull: {
    color: "#4A3F35",
    fontSize: 14,
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
    marginTop: 12,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerDate: {
    fontSize: 13,
    color: "#9B8678",
    fontWeight: "500",
  },

  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F3EEE9",
  },
  shareText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B4E3D",
  },

  toggleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3EEE9",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    marginTop: 4,
  },
});
