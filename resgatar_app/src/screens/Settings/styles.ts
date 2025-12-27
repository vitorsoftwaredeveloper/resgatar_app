import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F3EF",
  },
  content: {
    padding: 20,
  },
  menuCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  logout: {
    marginTop: 32,
    alignItems: "center",
  },
  logoutText: {
    color: "#D64545",
    fontSize: 16,
    fontWeight: "600",
  },
});
