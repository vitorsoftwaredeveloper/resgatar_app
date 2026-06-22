import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import {
  BaseToast,
  BaseToastProps,
  ToastConfig,
} from "react-native-toast-message";

// Cores das bordas (mesmas usadas pelos toasts padrão da lib).
const BORDER_COLORS = {
  success: "#69C779",
  error: "#FE6301",
  warning: "#FFC107",
  info: "#87CEFA",
};

// Sobrescreve a altura fixa (60px) e o truncamento em 1 linha dos toasts
// padrão, permitindo mensagens longas que crescem verticalmente.
function expandableProps(borderLeftColor: string): Partial<BaseToastProps> {
  const style: StyleProp<ViewStyle> = {
    height: "auto",
    minHeight: 60,
    width: "90%",
    paddingVertical: 12,
    borderLeftColor,
  };

  return {
    text1NumberOfLines: 0,
    text2NumberOfLines: 0,
    style,
    contentContainerStyle: {
      paddingHorizontal: 16,
      paddingVertical: 4,
    },
    text1Style: { fontSize: 16, fontWeight: "600" },
    text2Style: { fontSize: 14, fontWeight: "600" },
  };
}

export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast {...props} {...expandableProps(BORDER_COLORS.success)} />
  ),
  error: (props) => (
    <BaseToast {...props} {...expandableProps(BORDER_COLORS.error)} />
  ),
  warning: (props) => (
    <BaseToast {...props} {...expandableProps(BORDER_COLORS.warning)} />
  ),
  info: (props) => (
    <BaseToast {...props} {...expandableProps(BORDER_COLORS.info)} />
  ),
};
