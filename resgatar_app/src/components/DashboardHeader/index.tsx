import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { styles } from "./styles";
import { UserIcon } from "lucide-react-native";
import { COLORS } from "@/theme";

interface Props {
  name: string;
}

export function DashboardHeader({ name }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.avatar}>
          <UserIcon size={20} color={COLORS.white} />
        </View>

        <View>
          <Text style={styles.hello}>Olá,</Text>
          <Text style={styles.name}>{name}!</Text>
        </View>
      </View>

      {/* <View style={styles.logo} /> */}
    </View>
  );
}
