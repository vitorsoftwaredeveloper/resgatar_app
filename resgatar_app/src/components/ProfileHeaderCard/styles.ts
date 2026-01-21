import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F1ECE6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3E2C1C",
  },
  document: {
    fontSize: 14,
    color: "#8C7A6B",
    marginTop: 4,
  },
});
