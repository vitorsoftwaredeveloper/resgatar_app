import React from "react";
import { TouchableOpacity, Text, ButtonProps } from "react-native";
import { styles } from "./styles";

type Props = ButtonProps & {
  title: string;
  variant?: "primary" | "secondary" | "danger";
  styleCustom?: any;
};

export function Button({
  title,
  variant = "primary",
  styleCustom,
  disabled,
  ...rest
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        styleCustom,
      ]}
      {...rest}
    >
      <Text
        style={[
          styles.buttonText,
          variant !== "secondary" && styles.textOnPrimary,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
