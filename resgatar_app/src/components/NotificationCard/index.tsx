import React, { useEffect, useState } from "react";
import { View, Text, Pressable, LayoutChangeEvent } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { styles } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/theme";

type INotificationType = "info" | "success" | "warning";

interface INotification {
  id: string;
  title: string;
  description: string;
  date: string;
  type: INotificationType;
  isNew: boolean;
}

interface Props {
  notification: INotification;
  expanded: boolean;
  onToggle: () => void;
}

export const NotificationCard = ({
  notification,
  expanded,
  onToggle,
}: Props) => {
  const animatedHeight = useSharedValue(0);
  const rotate = useSharedValue(0);
  const [contentHeight, setContentHeight] = useState(0);

  // Mede a altura do conteúdo completo
  const handleContentLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && contentHeight === 0) {
      setContentHeight(height + 10);
    }
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

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    opacity: animatedHeight.value === 0 ? 0 : 1,
  }));

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <View style={[styles.card, styles[notification.type]]}>
      <View style={styles.textContainer}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={expanded ? undefined : 1}>
              {notification.title}
            </Text>
            {notification.isNew && (
              <View style={styles.newBadge}>
                <Ionicons name="notifications" size={10} color="#fff" />
                <Text style={styles.newText}>Novo</Text>
              </View>
            )}
          </View>
          <Text style={styles.date}>{notification.date}</Text>
        </View>

        {/* Preview da descrição (visível quando colapsado) */}
        {!expanded && (
          <Text style={styles.descriptionPreview} numberOfLines={2}>
            {notification.description}
          </Text>
        )}

        {/* Conteúdo expandido */}
        <Animated.View style={[styles.expandable, animatedStyle]}>
          <View onLayout={handleContentLayout}>
            <Text style={styles.descriptionFull}>
              {notification.description}
            </Text>
          </View>
        </Animated.View>

        {/* Conteúdo oculto para medição (renderizado fora da tela) */}
        {contentHeight === 0 && (
          <View style={styles.hiddenMeasure} onLayout={handleContentLayout}>
            <Text style={styles.descriptionFull}>
              {notification.description}
            </Text>
          </View>
        )}
      </View>

      {/* Botão de expandir no canto direito */}
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        style={styles.toggleButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Animated.View style={arrowStyle}>
          <Ionicons name="chevron-down" size={20} color="#8B7969" />
        </Animated.View>
      </Pressable>
    </View>
  );
};
