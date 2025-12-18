import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F3EF",
  },
  content: {
    padding: 20,
  },
  section: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3E2C1C",
    marginVertical: 16,
  },
  quick: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DDD",
    marginHorizontal: 4,
  },
  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6B4F3A",
    marginHorizontal: 4,
  },
});
