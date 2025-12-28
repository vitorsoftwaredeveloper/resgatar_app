import { StyleSheet } from "react-native";

export const typeColors = {
  info: {
    background: "#EDF3FF",
    border: "#AFC6FF",
    text: "#3B6DF6",
  },

  alert: {
    background: "#FDECEC",
    border: "#F5B7B1",
    text: "#C0392B",
  },

  warning: {
    background: "#FFF6E5",
    border: "#FFD591",
    text: "#E6A23C",
  },
};

export const styles = StyleSheet.create({
  typeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#EFE9E1",
    alignItems: "center",
    justifyContent: "center",
  },

  typeButtonText: {
    fontSize: 13,
    color: "#8A7E73",
  },
});
