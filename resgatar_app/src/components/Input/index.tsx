import { Text, TextInput, View } from "react-native";
import { useState } from "react";
import { styles } from "./styles";

export const Input = ({
  label,
  value,
  onChange,
  flex,
  highlighted,
  keyboardType = "default",
}: any) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.inputWrapper, flex && { flex: 1 }]}>
      <Text style={styles.inputLabel}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        style={[
          styles.inputBox,
          (highlighted || isFocused) && styles.inputHighlighted,
        ]}
        placeholderTextColor="#9E8E80"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
};
