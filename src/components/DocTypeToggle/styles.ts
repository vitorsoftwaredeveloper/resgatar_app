import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  toggle: {
    flexDirection: "row",
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 12,
  },
  item: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  text: {
    fontWeight: "600",
  },
  textActive: {
    color: "#FFF",
    fontWeight: "700",
  },
});
