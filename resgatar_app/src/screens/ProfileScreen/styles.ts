import { colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  option: {
    backgroundColor: colors.lightGray,
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  optionText: {
    fontSize: 18,
  },
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
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
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
  input: {
    height: 52,
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 20,
    color: colors.text,
  },
});
