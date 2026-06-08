import { useAppTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { useStyles } from "./styles";

type TextAreaProps = Omit<TextInputProps, "multiline" | "numberOfLines"> & {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string | false;
  numberOfLines?: number;
};

export const TextArea = ({
  label,
  value,
  onChangeText,
  error,
  numberOfLines = 4,
  ...props
}: TextAreaProps) => {
  const styles = useStyles(numberOfLines);
  const { colors } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(error);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.container,
          isFocused && styles.containerFocused,
          hasError && styles.containerError,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          multiline
          numberOfLines={numberOfLines}
          textAlignVertical="top"
          {...props}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>

      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
