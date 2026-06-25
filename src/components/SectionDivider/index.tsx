import React from "react";
import { Text, View } from "react-native";
import { useStyles } from "./styles";

interface Props {
  title: string;
  icon?: React.ReactNode;
}

export function SectionDivider({ title, icon }: Props) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <View style={styles.center}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.line} />
    </View>
  );
}
