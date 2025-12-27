import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const TAB_WIDTH = width / 3;
export const TAB_WIDTH_ADMIN = width / 4;
export const ACTIVE_COLOR = "#6B4F3A";
export const INACTIVE_COLOR = "#999";

export const styles = StyleSheet.create({
  container: {
    height: 72,
    backgroundColor: "#FFF",
    elevation: 15,
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
    flex: 1,
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
