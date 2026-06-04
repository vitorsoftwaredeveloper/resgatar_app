import { COLORS, RADIUS, SHADOW, SPACING, TYPOGRAPHY } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderLeftWidth: 4,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW.card,
  },
  labelBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.xxs,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: SPACING.xxs,
  },
  label: {
    fontSize: TYPOGRAPHY.xsmall,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  referencia: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: "700",
    color: COLORS.textStrong,
    marginBottom: SPACING.sm2,
  },
  refraoBlock: {
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm2,
    marginBottom: SPACING.sm,
  },
  refraoLabel: {
    fontSize: TYPOGRAPHY.xsmall,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  refraoText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textStrong,
    fontStyle: "italic",
    lineHeight: 22,
  },
  texto: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
    lineHeight: 26,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  hiddenMeasure: {
    position: "absolute",
    opacity: 0,
    zIndex: -1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: SPACING.sm,
  },
  toggleText: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
  },
});
