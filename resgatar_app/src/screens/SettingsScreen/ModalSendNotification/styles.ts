import { COLORS } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000055",
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    marginTop: 8,
  },
  listContent: {
    gap: 12,
  },

  label: {
    marginTop: 16,
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 6,
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  typeRow: {
    flexDirection: "row",
    gap: 12,
  },
  footer: {
    padding: 16,
    backgroundColor: COLORS.background,
  },

  containerInput: {
    height: 180,
    marginBottom: 12,
  },
});
