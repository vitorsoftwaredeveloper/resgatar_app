import { COLORS, RADIUS, SPACING } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    marginTop: SPACING.xs,
    backgroundColor: COLORS.muted,
    borderRadius: 16,
    padding: 30,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "700",
  },
});
