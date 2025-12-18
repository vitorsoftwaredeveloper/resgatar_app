import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { styles } from "./styles";

interface Props {
  name: string;
  document: string;
}

export function ProfileHeaderCard({ name, document }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <View style={styles.avatarIcon} />
      </View>

      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.document}>{document}</Text>
      </View>
    </View>
  );
}
