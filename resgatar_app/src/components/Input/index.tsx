import { Text, TextInput, TextInputProps, View } from "react-native";
import { useState } from "react";
import { styles } from "./styles";

import { ReactNode } from "react";

type IInputProps = TextInputProps & {
  label?: string;
  value: string;
  flex?: number;
  highlighted?: boolean;
  onChangeText: (text: string) => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export const Input = ({
  label,
  value,
  onChangeText,
  highlighted,
  leftIcon,
  rightIcon,
  ...props
}: IInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.inputWrapper, { flex: 1 }]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          (highlighted || isFocused) && styles.inputHighlighted,
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#9E8E80"
          style={styles.input}
          {...props}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
    </View>
  );
};
