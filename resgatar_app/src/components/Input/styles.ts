import { StyleSheet } from "react-native";
import { COLORS } from "@/theme";

export const styles = StyleSheet.create({
  inputWrapper: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 6,
  },
  inputBox: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  inputHighlighted: {
    borderColor: "#E0B96A",
    borderWidth: 2,
  },
});
