import { COLORS } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000055",
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },

  header: {
    backgroundColor: COLORS.primary,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "700",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF33",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    backgroundColor: COLORS.card,
    margin: 16,
    padding: 16,
    borderRadius: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },

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
  inputText: {
    fontSize: 16,
    color: COLORS.text,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  dateBox: {
    backgroundColor: "#EFE9E1",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  subLabel: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 8,
  },

  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  dayCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleActive: {
    backgroundColor: COLORS.primary,
  },
  dayText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  dayTextActive: {
    color: "#FFF",
  },

  toggle: {
    flexDirection: "row",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    marginBottom: 12,
  },
  toggleItem: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "#FFF",
    fontWeight: "700",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 16,
    backgroundColor: COLORS.background,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: "center",
  },
  saveText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
