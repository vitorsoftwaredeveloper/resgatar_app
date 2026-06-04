import { COLORS, SPACING } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.lg,
    paddingBottom: 0,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.primary,
    paddingBottom: 20,
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
