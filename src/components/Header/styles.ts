import { COLORS, SPACING } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 0,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgb(255, 255, 255,0.8)",
    padding: SPACING.lg,
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
    borderBottomStartRadius: 16,
    borderBottomEndRadius: 16,
  },
  textContainer: {
    flex: 1,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  hello: {
    color: COLORS.primary,
    fontSize: 14,
  },
  name: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "600",
    flexShrink: 1,
  },
});
