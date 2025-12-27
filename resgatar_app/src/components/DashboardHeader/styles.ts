import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#6B4F3A",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F1ECE6",
    marginRight: 12,
  },
  hello: {
    color: "#EADFD6",
    fontSize: 14,
  },
  name: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
});
