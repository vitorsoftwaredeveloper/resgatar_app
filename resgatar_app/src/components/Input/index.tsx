import React from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { styles } from "./styles";

interface InputProps extends TextInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({ leftIcon, rightIcon, ...rest }: InputProps) {
  return (
    <View style={styles.container}>
      {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
      <TextInput
        style={styles.input}
        placeholderTextColor="#999999"
        {...rest}
      />
      {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
    </View>
  );
}
