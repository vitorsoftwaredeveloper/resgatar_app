import { COLORS } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    // backgroundColor: colors.modalBackground,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    // color: colors.text,
    flex: 1,
  },
  input: {
    height: 52,
    // backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 20,
    // color: colors.text,
  },
});
