import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ToastConfig } from "react-native-toast-message";

const ICONS: Record<string, { bg: string; color: string; symbol: string }> = {
  success: { bg: "#E9F7EC", color: "#2E7D32", symbol: "✓" },
  error:   { bg: "#FDECEA", color: "#C62828", symbol: "✕" },
  warning: { bg: "#FFF8E1", color: "#F57F17", symbol: "!" },
  info:    { bg: "#E3F2FD", color: "#1565C0", symbol: "i" },
};

type NotifToastProps = {
  text1?: string;
  text2?: string;
  type: string;
};

function NotifToast({ text1, text2, type }: NotifToastProps) {
  const icon = ICONS[type] ?? ICONS.info;
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: icon.bg }]}>
          <Text style={[styles.iconSymbol, { color: icon.color }]}>{icon.symbol}</Text>
        </View>
        <Text style={styles.appName}>Resgatar</Text>
      </View>
      {!!text1 && <Text style={styles.title}>{text1}</Text>}
      {!!text2 && <Text style={styles.body}>{text2}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.08)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  iconBadge: {
    width: 18,
    height: 18,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  iconSymbol: {
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 13,
  },
  appName: {
    fontSize: 11,
    fontWeight: "500",
    color: "#9E9E9E",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    lineHeight: 18,
  },
  body: {
    fontSize: 13,
    color: "#616161",
    lineHeight: 18,
  },
});

export const toastConfig: ToastConfig = {
  success: (props) => <NotifToast type="success" text1={props.text1} text2={props.text2} />,
  error:   (props) => <NotifToast type="error"   text1={props.text1} text2={props.text2} />,
  warning: (props) => <NotifToast type="warning" text1={props.text1} text2={props.text2} />,
  info:    (props) => <NotifToast type="info"    text1={props.text1} text2={props.text2} />,
};
