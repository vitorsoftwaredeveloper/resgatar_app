import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { styles } from "./styles";

interface Props {
  label: string;
  onPress: () => void;
}

export function QuickAccessItem({ label, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.icon} />
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}
