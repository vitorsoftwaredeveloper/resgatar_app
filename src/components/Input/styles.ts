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

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 14,
  },

  input: {
    flex: 1,
    paddingVertical: 14,
    color: COLORS.text,
  },

  iconLeft: {
    marginRight: 8,
  },

  iconRight: {
    marginLeft: 8,
  },

  inputHighlighted: {
    borderColor: "#E0B96A",
    borderWidth: 2,
  },

  inputError: {
    borderColor: COLORS.error,
  },

  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
});
