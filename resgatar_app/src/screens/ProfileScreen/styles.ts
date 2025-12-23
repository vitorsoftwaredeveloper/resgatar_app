import { colors } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F3EF",
  },
  header: {
    backgroundColor: "#6B4F3A",
    paddingVertical: 24,
    alignItems: "center",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
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
