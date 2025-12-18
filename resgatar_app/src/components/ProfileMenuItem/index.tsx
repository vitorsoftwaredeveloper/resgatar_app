import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { styles } from "./styles";

interface Props {
  title: string;
  description: string;
  onPress: () => void;
  isLast?: boolean;
  icon?: any;
}

export function ProfileMenuItem({
  title,
  description,
  onPress,
  isLast,
  icon,
}: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.left}>
        <View style={styles.icon}>{icon && icon}</View>
      </View>

      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <Text style={styles.arrow}>›</Text>

      {!isLast && <View style={styles.divider} />}
    </TouchableOpacity>
  );
}
