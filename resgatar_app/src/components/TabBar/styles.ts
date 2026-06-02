import { COLORS } from "@/theme";
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const TAB_WIDTH = width / 3;
export const TAB_WIDTH_ADMIN = width / 4;
export const ACTIVE_COLOR = COLORS.primary;
export const INACTIVE_COLOR = COLORS.background;

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.muted,
    elevation: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
  },
  indicator: {
    position: "absolute",
    top: 0,
    height: 4,
    width: TAB_WIDTH,
    backgroundColor: ACTIVE_COLOR,
  },
  indicatorAdmin: {
    width: TAB_WIDTH_ADMIN,
  },
  row: {
    flexDirection: "row",
    height: 72,
  },
  tab: {
    width: TAB_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  tabAdmin: {
    width: TAB_WIDTH_ADMIN,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: 4,
    fontSize: 12,
  },
});
