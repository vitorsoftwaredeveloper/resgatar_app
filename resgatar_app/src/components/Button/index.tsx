import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ButtonProps,
  View,
} from "react-native";
import { styles } from "./styles";

type Props = ButtonProps & {
  title: string;
  variant?: "primary" | "secondary";
  styleCustom?: any;
  leftIcon?: React.ReactNode;
  rigthtIcon?: React.ReactNode;
};

export function Button({
  title,
  variant = "primary",
  styleCustom,
  disabled,
  onPress,
  leftIcon,
  rigthtIcon,
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {leftIcon && leftIcon}
          <Text
            style={[
              styles.buttonText,
              variant === "primary" && styles.textOnPrimary,
              variant === "secondary" && styles.textOnSecondary,
            ]}
          >
            {title}
          </Text>
          {rigthtIcon && rigthtIcon}
        </View>
      )}
    </TouchableOpacity>
  );
}
