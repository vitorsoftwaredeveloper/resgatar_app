import { COLORS } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.muted,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  hello: {
    color: COLORS.background,

    fontSize: 14,
  },
  name: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "600",
  },
});
