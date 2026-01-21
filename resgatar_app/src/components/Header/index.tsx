import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import { COLORS } from "@/theme";
import { LogoResgatar } from "../Svg/Logo";

interface Props {
  name: string;
}

export function Header({ name }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.logo}>
          <LogoResgatar size={100} color={COLORS.background} />
        </View>
        <View>
          <Text style={styles.hello}>Olá,</Text>
          <Text style={styles.name}>{name}!</Text>
        </View>
      </View>
    </View>
  );
}
