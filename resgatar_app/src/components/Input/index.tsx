import { Text, TextInput, View } from "react-native";
import { useState } from "react";
import { styles } from "./styles";

export const Input = ({
  label,
  value,
  onChangeText,
  flex,
  highlighted,
  keyboardType = "default",
  placeholder,
  secureTextEntry,
  autoCapitalize,
}: any) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.inputWrapper, flex && { flex: 1 }]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        placeholder={placeholder}
        placeholderTextColor="#9E8E80"
        style={[
          styles.inputBox,
          (highlighted || isFocused) && styles.inputHighlighted,
        ]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
};
