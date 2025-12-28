import { COLORS } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: COLORS.softBrown,
    justifyContent: "center",
    padding: 24,
  },

  card: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingVertical: 32,
    minHeight: "55%",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: COLORS.text,
    marginTop: 32,
  },

  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: COLORS.muted,
    marginBottom: 32,
    marginTop: 8,
    fontStyle: "italic",
  },

  submitButton: {
    marginTop: 24,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
    justifyContent: "center",
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.softBrown,
  },

  footerText: {
    marginHorizontal: 12,
    color: COLORS.muted,
    fontSize: 14,
    fontStyle: "italic",
  },
});
