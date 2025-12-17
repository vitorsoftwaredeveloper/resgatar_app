import React, { useState } from "react";
import { TextInput, TextInputProps, View, Animated } from "react-native";
import { styles } from "./styles";
import { colors } from "@/theme/colors";

interface InputProps extends TextInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  height?: number;
}

export function Input({
  leftIcon,
  rightIcon,
  label,
  value,
  height,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [animation] = useState(new Animated.Value(value ? 1 : 0));

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }).start();
    }
  };

  const labelStyle = {
    position: "absolute" as const,
    left: leftIcon ? 48 : 14,
    top: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -7],
    }),
    fontSize: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [15, 12],
    }),
    color: isFocused ? colors.primary.main : colors.text.muted,
    backgroundColor: colors.input.background,
    paddingHorizontal: 6,
  };

  return (
    <View
      style={[
        styles.container,
        isFocused && styles.focused,
        height ? { height } : {},
      ]}
    >
      {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

      {label && <Animated.Text style={labelStyle}>{label}</Animated.Text>}

      <TextInput
        style={styles.input}
        placeholderTextColor={colors.input.textMuted}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value}
        {...rest}
      />

      {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
    </View>
  );
}
