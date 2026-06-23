import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useStyles } from "./styles";

interface Props {
  title: string;
  description: string;
  onPress: () => void;
  isLast?: boolean;
  icon?: any;
}

export function ItemActionList({
  title,
  description,
  onPress,
  isLast,
  icon,
}: Props) {
  const styles = useStyles();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.row}>
        <View style={styles.icon}>{icon && icon}</View>

        <View style={styles.center}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </View>

      {!isLast && <View style={styles.divider} />}
    </TouchableOpacity>
  );
}
