import { COLORS } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  iconSvg: {
    color: COLORS.primary,
  },
  info: {
    flex: 1,
  },
  month: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3E2C1C",
  },
  description: {
    fontSize: 14,
    color: "#8C7A6B",
    marginTop: 2,
  },
  right: {
    alignItems: "flex-end",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3E2C1C",
  },
  badge: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pending: {
    backgroundColor: COLORS.waiting,
  },
  paid: {
    backgroundColor: COLORS.successBackground,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  pendingText: {
    color: COLORS.white,
  },
  paidText: {
    color: COLORS.success,
  },
});
