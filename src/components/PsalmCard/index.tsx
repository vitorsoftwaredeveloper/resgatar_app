import React, { useEffect, useState } from "react";
import { View, Text, Pressable, LayoutChangeEvent } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { ChevronDown } from "lucide-react-native";
import { useStyles } from "./styles";

interface Props {
  referencia: string;
  refrao?: string;
  texto: string;
  accentColor: string;
}

export function PsalmCard({ referencia, refrao, texto, accentColor }: Props) {
  const styles = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useSharedValue(0);
  const rotate = useSharedValue(0);

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
      style={[styles.card, { borderLeftColor: accentColor }]}
      onPress={() => setExpanded((v) => !v)}
      accessibilityRole="button"
    >
      <View style={[styles.labelBadge, { backgroundColor: accentColor + "22" }]}>
        <Text style={[styles.label, { color: accentColor }]}>SALMO RESPONSORIAL</Text>
      </View>

      <Text style={styles.referencia}>{referencia}</Text>

      {!!refrao && (
        <View style={[styles.refraoBlock, { borderColor: accentColor + "55", backgroundColor: accentColor + "11" }]}>
          <Text style={[styles.refraoLabel, { color: accentColor }]}>Refrão</Text>
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
        <Text style={[styles.toggleText, { color: accentColor }]}>
          {expanded ? "Fechar" : "Ler salmo completo"}
        </Text>
        <Animated.View style={arrowStyle}>
          <ChevronDown size={16} color={accentColor} />
        </Animated.View>
      </View>
    </Pressable>
  );
}
