import { useAppTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

interface Props {
  value: "CPF" | "CNPJ";
  onChange: (type: "CPF" | "CNPJ") => void;
}

export const DocTypeToggle = ({ value, onChange }: Props) => {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.toggle, { borderColor: colors.border }]}>
      {(["CPF", "CNPJ"] as const).map((type) => (
        <TouchableOpacity
          key={type}
          onPress={() => onChange(type)}
          style={[
            styles.item,
            value === type && { backgroundColor: colors.primary },
          ]}
        >
          <Text
            style={[
              styles.text,
              { color: colors.text },
              value === type && styles.textActive,
            ]}
          >
            {type}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
