import { StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 56,
    backgroundColor: colors.input.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.input.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
  },

  focused: {
    borderColor: colors.input.focus,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingHorizontal: 10,
    paddingVertical: 14,
  },

  iconContainer: {
    paddingHorizontal: 10,
  },
});
