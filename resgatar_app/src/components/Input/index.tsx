import React, { useState } from "react";
import { TextInput, TextInputProps, View, Text, Animated } from "react-native";
import { styles } from "./styles";

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
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const labelStyle = {
    position: "absolute" as const,
    left: leftIcon ? 52 : 12,
    top: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [16, -8],
    }),
    fontSize: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    // color: isFocused ? "#67159C" : "#999999",
    color: "#999999",
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
        style={[styles.input, label && { paddingTop: 16 }]}
        placeholderTextColor="#999999"
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value}
        {...rest}
      />
      {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
    </View>
  );
}
