import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ButtonProps,
} from "react-native";
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
  onPress,
  ...rest
}: Props) {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (!onPress || loading) return;

    try {
      setLoading(true);
      // @ts-ignore
      await onPress(); // 👈 espera a Promise
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled || loading}
      onPress={handlePress}
      style={[
        styles.button,
        styles[variant],
        (disabled || loading) && styles.disabled,
        styleCustom,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFF" />
      ) : (
        <Text
          style={[
            styles.buttonText,
            variant !== "secondary" && styles.textOnPrimary,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
