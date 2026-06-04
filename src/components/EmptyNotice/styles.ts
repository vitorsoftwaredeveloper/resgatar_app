import { COLORS } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 16,
    opacity: 0.9,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 4,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#9B8678",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 220,
  },
});
