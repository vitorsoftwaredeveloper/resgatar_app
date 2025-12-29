import { COLORS } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    margin: 16,
  },

  container: {
    height: "100%",
    backgroundColor: COLORS.softBrown,
  },

  header: {
    backgroundColor: COLORS.primary,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    color: COLORS.white,
    marginBottom: 24,
  },

  qrIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.mutedBackground,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  qrIconText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.white,
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 2,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#9C7A5C",
    justifyContent: "center",
    alignItems: "center",
  },

  amountContainer: {
    alignItems: "center",
    marginBottom: 24,
  },

  amountLabel: {
    fontSize: 14,
    color: "#8C7A6B",
    marginBottom: 4,
  },

  amount: {
    fontSize: 36,
    fontWeight: "700",
    color: COLORS.text,
  },

  qrContainer: {
    alignItems: "center",
    marginBottom: 16,
  },

  qrBox: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#DDD2C7",
    backgroundColor: "#fff",
  },

  helperText: {
    textAlign: "center",
    fontSize: 14,
    color: "#8C7A6B",
    marginBottom: 16,
  },

  pixCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.border,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    marginHorizontal: 48,
  },

  pixCode: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },

  copyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },

  infoBox: {
    backgroundColor: COLORS.muted,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    marginHorizontal: 48,
  },

  infoText: {
    fontSize: 13,
    color: COLORS.white,
    textAlign: "center",
    lineHeight: 18,
  },

  badge: {
    alignSelf: "center",
    backgroundColor: COLORS.waiting,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },

  badgeText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "600",
  },

  badgePaid: {
    backgroundColor: COLORS.successBackground,
  },

  badgePaidText: {
    color: COLORS.success,
    fontWeight: "700",
    alignSelf: "center",
    borderRadius: 20,
    fontSize: 16,
  },

  containerCopy: {
    alignItems: "center",
    justifyContent: "center",
  },

  tooltipContainer: {
    position: "absolute",
    bottom: 42,
    alignItems: "center",
    width: 70,
    marginLeft: 12,
  },

  balloon: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },

  balloonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "500",
  },

  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: "#00000000",
    borderRightColor: "#00000000",
    borderTopColor: COLORS.primary,
  },
});
