import { StyleSheet } from "react-native";
import { COLORS } from "@/theme/colors";

export const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  primary: {
    backgroundColor: COLORS.primary,
  },

  secondary: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.background,
  },

  danger: {
    backgroundColor: COLORS.background,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.background,
  },

  textOnPrimary: {
    color: COLORS.background,
  },

  disabled: {
    opacity: 0.6,
  },
});
