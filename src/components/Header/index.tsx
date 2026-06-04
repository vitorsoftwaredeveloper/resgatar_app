import { COLORS } from "@/theme";
import React from "react";
import { Text, View } from "react-native";
import { LogoResgatar } from "../Svg/Logo";
import { styles } from "./styles";

interface Props {
  name: string;
}

export function Header({ name }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.logo}>
          <LogoResgatar size={100} color={COLORS.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.hello}>Olá,</Text>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {name}
          </Text>
        </View>
      </View>
    </View>
  );
}
