import React, { useEffect, useState } from "react";
import { View, Text, Pressable, LayoutChangeEvent } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { ChevronDown } from "lucide-react-native";
import { styles } from "./styles";

interface Props {
  label: string;
  referencia: string;
  titulo?: string;
  texto: string;
  accentColor: string;
  isGospel?: boolean;
  defaultExpanded?: boolean;
}

function formatVerseText(text: string, baseStyle: any) {
  const parts = text.split(/(\d+)(?=[A-Za-zÀ-ÿ])/);
  return parts.map((part, i) =>
    /^\d+$/.test(part) ? (
      <Text key={i} style={styles.verseNumber}>
        {part}{" "}
      </Text>
    ) : (
      <Text key={i} style={baseStyle}>
        {part}
      </Text>
    ),
  );
}

export function ReadingCard({
  label,
  referencia,
  titulo,
  texto,
  accentColor,
  isGospel = false,
  defaultExpanded = false,
}: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded);
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
      style={[
        styles.card,
        { borderLeftColor: accentColor },
        isGospel && styles.gospelCard,
      ]}
      onPress={() => setExpanded((v) => !v)}
      accessibilityRole="button"
    >
      <View
        style={[styles.labelBadge, { backgroundColor: accentColor + "22" }]}
      >
        <Text style={[styles.label, { color: accentColor }]}>{label}</Text>
      </View>

      {!!referencia && <Text style={styles.referencia}>{referencia}</Text>}
      {!!titulo && <Text style={styles.titulo}>{titulo}</Text>}

      <Animated.View style={expandStyle}>
        <View onLayout={handleContentLayout}>
          <Text style={styles.texto}>
            {formatVerseText(texto, styles.texto)}
          </Text>
        </View>
      </Animated.View>

      {contentHeight === 0 && (
        <View style={styles.hiddenMeasure} onLayout={handleContentLayout}>
          <Text style={styles.texto}>
            {formatVerseText(texto, styles.texto)}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={[styles.toggleText, { color: accentColor }]}>
          {expanded ? "Fechar" : "Ler leitura"}
        </Text>
        <Animated.View style={arrowStyle}>
          <ChevronDown size={16} color={accentColor} />
        </Animated.View>
      </View>
    </Pressable>
  );
}
