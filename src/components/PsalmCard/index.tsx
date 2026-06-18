import { useAppTheme } from "@/context/ThemeContext";
import { ChevronDown } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useStyles } from "./styles";

interface Props {
  referencia: string;
  refrao?: string;
  texto: string;
  testID?: string;
}

export function PsalmCard({ referencia, refrao, texto, testID }: Props) {
  const styles = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useSharedValue(0);
  const rotate = useSharedValue(0);
  const { colors } = useAppTheme();
  const handleContentLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    if (height > 0 && contentHeight === 0) setContentHeight(height + 8);
  };

  useEffect(() => {
    if (contentHeight > 0) {
      animatedHeight.value = withTiming(expanded ? contentHeight : 0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
    }
    rotate.value = withTiming(expanded ? 180 : 0, {
      duration: 250,
      easing: Easing.inOut(Easing.ease),
    });
  }, [expanded, contentHeight]);

  const expandStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    overflow: "hidden",
  }));

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <Pressable
      testID={testID}
      style={[styles.card]}
      onPress={() => setExpanded((v) => !v)}
      accessibilityRole="button"
    >
      <View style={[styles.labelBadge]}>
        <Text style={[styles.label]}>SALMO RESPONSORIAL</Text>
      </View>

      <Text style={styles.referencia}>{referencia}</Text>

      {!!refrao && (
        <View style={[styles.refraoBlock]}>
          <Text style={[styles.refraoLabel]}>Refrão</Text>
          <Text style={styles.refraoText}>{refrao}</Text>
        </View>
      )}

      <Animated.View style={expandStyle}>
        <View onLayout={handleContentLayout}>
          <Text style={styles.texto}>{texto}</Text>
        </View>
      </Animated.View>

      {contentHeight === 0 && (
        <View style={styles.hiddenMeasure} onLayout={handleContentLayout}>
          <Text style={styles.texto}>{texto}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={[styles.toggleText]}>
          {expanded ? "Ocultar" : "Ver mais"}
        </Text>
        <Animated.View style={arrowStyle}>
          <ChevronDown size={16} color={colors.primary} />
        </Animated.View>
      </View>
    </Pressable>
  );
}
