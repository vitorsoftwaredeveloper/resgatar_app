import { useAppTheme } from "@/context/ThemeContext";
import { ReactNode, useState } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { useStyles } from "./styles";

type InputProps = TextInputProps & {
  label?: string;
  value?: string;
  flex?: number;
  highlighted?: boolean;
  onChangeText?: (text: string) => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string | false;
};

export const Input = ({
  label,
  value,
  onChangeText,
  highlighted,
  leftIcon,
  rightIcon,
  error,
  flex = 1,
  ...props
}: InputProps) => {
  const styles = useStyles();
  const { colors } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(error);

  return (
    <View style={[styles.inputWrapper, { flex }]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          (highlighted || isFocused) && styles.inputHighlighted,
          hasError && styles.inputError,
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          {...props}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>

      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
