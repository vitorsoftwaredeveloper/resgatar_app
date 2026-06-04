import { COLORS } from "@/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const TAB_WIDTH = width / 3;
export const TAB_WIDTH_ADMIN = width / 4;
export const ACTIVE_COLOR = COLORS.textMuted;
export const INACTIVE_COLOR = COLORS.muted;

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgb(255, 255, 255,0.9)",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
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
