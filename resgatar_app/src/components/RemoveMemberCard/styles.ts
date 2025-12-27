import { COLORS } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFEAE3",
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontWeight: "600",
    color: "#3B2F2F",
    maxWidth: 230,
  },
  userEmail: {
    fontSize: 13,
    color: "#7A6E63",
    maxWidth: 230,
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F2DEDA",
    alignItems: "center",
    justifyContent: "center",
  },
});
