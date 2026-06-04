import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ButtonProps,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";

type Props = ButtonProps & {
  title: string;
  variant?: "primary" | "secondary";
  styleCustom?: any;
  leftIcon?: React.ReactNode;
  rigthtIcon?: React.ReactNode;
  loading?: boolean;
  onPress?: () => Promise<void> | void;
};

export function Button({
  title,
  variant = "primary",
  styleCustom,
  disabled,
  onPress,
  leftIcon,
  rigthtIcon,
  loading: externalLoading,
  ...rest
}: Props) {
  const [internalLoading, setInternalLoading] = useState(false);

  const isControlled = typeof externalLoading === "boolean";
  const loading = isControlled ? externalLoading : internalLoading;

  const handlePress = useCallback(async () => {
    if (!onPress || loading) return;

    const result: any = onPress();

    if (!isControlled && result instanceof Promise) {
      try {
        setInternalLoading(true);
        await result;
      } finally {
        setInternalLoading(false);
      }
    }
  }, [onPress, loading, isControlled]);

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
          {leftIcon}
          <Text
            style={[
              styles.buttonText,
              variant === "primary" && styles.textOnPrimary,
              variant === "secondary" && styles.textOnSecondary,
            ]}
          >
            {title}
          </Text>
          {rigthtIcon}
        </View>
      )}
    </TouchableOpacity>
  );
}
