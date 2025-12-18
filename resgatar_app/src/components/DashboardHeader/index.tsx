import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { styles } from "./styles";

interface Props {
  name: string;
}

export function DashboardHeader({ name }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.logo} />
        <View>
          <Text style={styles.hello}>Olá,</Text>
          <Text style={styles.name}>{name}!</Text>
        </View>
      </View>

      <View style={styles.avatar} />
    </View>
  );
}
