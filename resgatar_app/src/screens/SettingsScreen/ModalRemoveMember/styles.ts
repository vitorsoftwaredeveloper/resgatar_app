import { COLORS, RADIUS, SPACING } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000055",
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
    marginBottom: SPACING.xxs,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "700",
  },
  list: {
    marginTop: 8,
  },
  listContent: {
    gap: 12,
  },
});
