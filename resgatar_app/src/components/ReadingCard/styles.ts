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
  gospelCard: {
    borderLeftWidth: 6,
    paddingVertical: SPACING.lg,
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
    marginBottom: 4,
  },
  titulo: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textMuted,
    fontStyle: "italic",
    marginBottom: SPACING.sm,
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
