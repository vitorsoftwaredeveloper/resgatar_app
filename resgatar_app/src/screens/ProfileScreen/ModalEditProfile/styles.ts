import { colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.modalBackground,
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
    color: colors.text,
    flex: 1,
  },
  saveButtonText: {
    marginTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  dayPickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  dayOption: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginRight: 5,
    marginBottom: 5,
    backgroundColor: colors.background,
  },
  dayOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayText: {
    fontSize: 16,
    color: colors.text,
  },
  dayTextSelected: {
    color: colors.white,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
  },
  radioOption: {
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginRight: 10,
    backgroundColor: colors.background,
  },
  radioOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  radioText: {
    fontSize: 16,
    color: colors.text,
  },
  radioTextSelected: {
    color: colors.white,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: colors.text,
  },
  pickerContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
});
