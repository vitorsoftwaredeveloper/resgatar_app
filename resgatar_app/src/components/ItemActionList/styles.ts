import { COLORS } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    position: "relative",
  },
  left: {
    position: "absolute",
    left: 0,
    top: 18,
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    backgroundColor: COLORS.background,
    borderRadius: 12,
  },
  center: {
    marginLeft: 56,
    marginRight: 24,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3E2C1C",
  },
  description: {
    fontSize: 13,
    color: "#8C7A6B",
    marginTop: 2,
  },
  arrow: {
    position: "absolute",
    right: 0,
    top: 22,
    fontSize: 22,
    color: "#8C7A6B",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5DDD5",
    marginTop: 16,
    marginLeft: 56,
  },
});
