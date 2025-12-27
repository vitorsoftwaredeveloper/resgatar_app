import { COLORS } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6E0D8",
  },
  texts: {
    gap: 8,
  },
  lineLarge: {
    width: 120,
    height: 14,
    borderRadius: 8,
    backgroundColor: "#E6E0D8",
  },
  lineSmall: {
    width: 160,
    height: 12,
    borderRadius: 8,
    backgroundColor: "#E6E0D8",
  },
  action: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#E6E0D8",
  },
});
