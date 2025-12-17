import { colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  /* ===== CONTAINER ===== */
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  modalContent: {
    paddingHorizontal: 20,
    paddingBottom: 48,
  },

  /* ===== HEADER ===== */
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 20,
    paddingVertical: 16,

    backgroundColor: colors.surface.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface.border,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
  },

  /* ===== CAMPOS ===== */
  field: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },

  /* ===== SEÇÕES ===== */
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginTop: 32,
    marginBottom: 16,
  },

  section: {
    marginTop: 10,
    gap: 16,
  },

  /* ===== DIA CONTRIBUIÇÃO ===== */
  dayPickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },

  dayOption: {
    width: 44,
    height: 44,
    borderRadius: 12,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.surface.secondary,
    borderWidth: 1,
    borderColor: colors.surface.border,
  },

  dayOptionSelected: {
    backgroundColor: colors.surface.border,
  },

  dayText: {
    fontSize: 15,
    color: colors.text.primary,
  },

  dayTextSelected: {
    color: colors.text.onPrimary,
    fontWeight: "600",
  },

  /* ===== CPF / CNPJ ===== */
  pickerContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  radioOption: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,

    alignItems: "center",

    backgroundColor: colors.surface.secondary,
    borderWidth: 1,
    borderColor: colors.surface.border,
  },

  radioOptionSelected: {
    backgroundColor: colors.surface.border,
  },

  radioText: {
    fontSize: 15,
    color: colors.text.primary,
  },

  radioTextSelected: {
    color: colors.text.onPrimary,
    fontWeight: "600",
  },

  /* ===== BOTÕES ===== */
  saveButtonText: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,

    marginTop: 40,
    marginBottom: 24,
  },
});
