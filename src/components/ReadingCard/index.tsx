import { useAppTheme } from "@/context/ThemeContext";
import { TTSState } from "@/hooks/useLiturgyTTS";
import { ChevronDown, Pause, Play } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, Pressable, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useStyles } from "./styles";

interface Props {
  label: string;
  referencia: string;
  titulo?: string;
  texto: string;
  formulaFinal?: string;
  defaultExpanded?: boolean;
  testID?: string;
  ttsState?: TTSState;
  onTTSPlay?: () => void;
  onTTSPause?: () => void;
}

function formatVerseText(text: string, textStyle: any, verseStyle: any) {
  const parts = text.split(/(\d+)(?=[A-Za-zÀ-ÿ])/);
  return parts.map((part, i) =>
    /^\d+$/.test(part) ? (
      <Text key={i} style={verseStyle}>
        {part}{" "}
      </Text>
    ) : (
      <Text key={i} style={textStyle}>
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
  formulaFinal,
  defaultExpanded = false,
  testID,
  ttsState,
  onTTSPlay,
  onTTSPause,
}: Props) {
  const styles = useStyles();
  const [expanded, setExpanded] = useState(defaultExpanded);
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
      style={styles.card}
      onPress={() => setExpanded((v) => !v)}
      accessibilityRole="button"
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.label]}>{label}</Text>
        {onTTSPlay && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              ttsState === "playing" ? onTTSPause?.() : onTTSPlay();
            }}
            style={[styles.ttsBtn, ttsState === "playing" && styles.ttsBtnActive]}
            accessibilityLabel={ttsState === "playing" ? "Pausar leitura" : "Ouvir leitura"}
          >
            {ttsState === "playing" ? (
              <Pause size={13} color={colors.primary} fill={colors.primary} />
            ) : (
              <Play size={13} color={colors.primary} fill={colors.primary} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {!!referencia && <Text style={styles.referencia}>{referencia}</Text>}
      {!!titulo && <Text style={styles.titulo}>{titulo}</Text>}

      <View style={styles.toggleRow}>
        <Text style={[styles.toggleText]}>
          {expanded ? "Ocultar" : "Ver mais"}
        </Text>
        <Animated.View style={arrowStyle}>
          <ChevronDown size={16} color={colors.primary} />
        </Animated.View>
      </View>

      <Animated.View style={expandStyle}>
        <View onLayout={handleContentLayout}>
          <Text style={styles.texto}>
            {formatVerseText(texto, styles.texto, styles.verseNumber)}
          </Text>
          {!!formulaFinal && (
            <Text style={[styles.formulaFinal]}>{`— ${formulaFinal}`}</Text>
          )}
        </View>
      </Animated.View>

      {contentHeight === 0 && (
        <View style={styles.hiddenMeasure} onLayout={handleContentLayout}>
          <Text style={styles.texto}>
            {formatVerseText(texto, styles.texto, styles.verseNumber)}
          </Text>
          {!!formulaFinal && (
            <Text style={[styles.formulaFinal]}>{`— ${formulaFinal}`}</Text>
          )}
        </View>
      )}
    </Pressable>
  );
}
