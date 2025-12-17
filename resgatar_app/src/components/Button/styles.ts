import { StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

export const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  /* VARIANTS */
  primary: {
    backgroundColor: colors.primary.main,
  },

  secondary: {
    backgroundColor: colors.surface.secondary,
    borderWidth: 1,
    borderColor: colors.surface.border,
  },

  danger: {
    backgroundColor: colors.status.error,
  },

  /* TEXT */
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
  },

  textOnPrimary: {
    color: colors.text.onPrimary,
  },

  /* DISABLED */
  disabled: {
    opacity: 0.6,
  },
});
