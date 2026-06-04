import React from "react";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";
import { LogoResgatar } from "@/components/Svg/Logo";
import { COLORS } from "@/theme";

export const LoadingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <LogoResgatar color={COLORS.muted} size={400} />
        </View>

        <ActivityIndicator
          size={300}
          animating={true}
          color={COLORS.muted}
          style={styles.loader}
        />
      </View>
    </SafeAreaView>
  );
};
