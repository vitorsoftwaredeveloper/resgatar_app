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
    backgroundColor: "#F4ECE6",
    marginRight: 12,
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
    backgroundColor: "#FDECEC",
  },
  paid: {
    backgroundColor: "#EFEAE5",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  pendingText: {
    color: "#D64545",
  },
  paidText: {
    color: "#8C6A4A",
  },
  button: {
    marginTop: 16,
    backgroundColor: "#6B4F3A",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
