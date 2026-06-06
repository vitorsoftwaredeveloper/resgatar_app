import React from "react";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStyles } from "./styles";
import { useAppTheme } from "@/context/ThemeContext";
import { LogoResgatar } from "@/components/Svg/Logo";

interface ILoadingProps {}
export const LoadingScreen = ({}: ILoadingProps) => {
  const styles = useStyles();
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <LogoResgatar color={colors.primary} size={400} />
        </View>

        <ActivityIndicator
          size={300}
          animating={true}
          color={colors.primary}
          style={styles.loader}
        />
      </View>
    </SafeAreaView>
  );
};
