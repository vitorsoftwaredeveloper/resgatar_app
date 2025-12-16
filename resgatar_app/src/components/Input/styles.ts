import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 52,
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
  },
  focused: {
    borderColor: colors.primary,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: colors.text,
    paddingHorizontal: 12,
  },
  iconContainer: {
    paddingHorizontal: 12,
  },
});
