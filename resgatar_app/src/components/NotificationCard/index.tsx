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
import { INotification } from "@/types/Notification";
import { timeAgo } from "@/utils/helper";

interface Props {
  notification: INotification;
  expanded: boolean;
  onToggle: () => void;
  onShare?: () => void;
}

const notificationConfig = {
  info: {
    label: "Comunicado",
    icon: "megaphone-outline",
    tagBg: "#EDF3FF",
    tagText: "#3B6DF6",
  },
  alert: {
    label: "Urgente",
    icon: "alert-circle-outline",
    tagBg: "#FDECEC",
    tagText: "#E53935",
  },
  warning: {
    label: "Aviso",
    icon: "warning-outline",
    tagBg: "#FFF6E5",
    tagText: "#E6A23C",
  },
};

const getTagLabel = (type: string) => {
  switch (type) {
    case "info":
      return "Comunicado";
    case "alert":
      return "Urgente";
    case "warning":
      return "Aviso";
    default:
      return "Comunicado";
  }
};

const getTagIcon = (type: string) => {
  switch (type) {
    case "info":
      return "megaphone-outline";
    case "alert":
      return "alert-circle-outline";
    case "warning":
      return "warning-outline";
    default:
      return "megaphone-outline";
  }
};

export const NotificationCard = ({
  notification,
  expanded,
  onToggle,
}: Props) => {
  const animatedHeight = useSharedValue(0);
  const rotate = useSharedValue(0);
  const [contentHeight, setContentHeight] = useState(0);
  const config = notificationConfig[notification.type];

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
    <Pressable
      onPress={onToggle}
      style={[styles.card, styles[notification.type]]}
      accessibilityRole="button"
      accessibilityLabel={`Notificação: ${notification.title}`}
      accessibilityHint={
        expanded ? "Tocar para recolher" : "Tocar para expandir"
      }
    >
      <View style={styles.textContainer}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={expanded ? undefined : 1}>
              {notification.title || "Título"}
            </Text>

            <View style={styles.toggleButton}>
              <Animated.View style={arrowStyle}>
                <Ionicons name="chevron-down" size={20} color="#8B7969" />
              </Animated.View>
            </View>
          </View>

          {!expanded && (
            <View style={styles.footerLeft}>
              {notification.isNew && (
                <View style={styles.newBadge}>
                  <Ionicons name="notifications" size={10} color="#fff" />
                  <Text style={styles.newText}>Novo</Text>
                </View>
              )}
              <Ionicons name="time-outline" size={16} color="#9B8678" />
              <Text style={styles.footerDate}>
                {timeAgo(notification.createdAt)}
              </Text>
            </View>
          )}
        </View>

        {expanded && (
          <View
            style={[styles.tagContainer, { backgroundColor: config.tagBg }]}
          >
            <Ionicons
              name={config.icon as any}
              size={16}
              color={config.tagText}
              style={styles.tagIcon}
            />
            <Text style={[styles.tagLabel, { color: config.tagText }]}>
              {config.label}
            </Text>
          </View>
        )}

        {expanded && <View style={styles.divider} />}

        {!expanded && (
          <Text style={styles.descriptionPreview} numberOfLines={2}>
            {notification.description || "Descrição da notificação"}
          </Text>
        )}

        <Animated.View style={[styles.expandable, animatedStyle]}>
          <View onLayout={handleContentLayout}>
            <Text style={styles.descriptionFull}>
              {notification.description || "Descrição da notificação"}
            </Text>
          </View>
        </Animated.View>

        {contentHeight === 0 && (
          <View style={styles.hiddenMeasure} onLayout={handleContentLayout}>
            <Text style={styles.descriptionFull}>
              {notification.description}
            </Text>
          </View>
        )}

        {expanded && (
          <>
            <View style={styles.divider} />
            <View style={styles.footer}>
              <View style={styles.footerLeft}>
                {notification.isNew && (
                  <View style={styles.newBadge}>
                    <Ionicons name="notifications" size={10} color="#fff" />
                    <Text style={styles.newText}>Novo</Text>
                  </View>
                )}
                <Ionicons name="time-outline" size={16} color="#9B8678" />
                <Text style={styles.footerDate}>
                  {timeAgo(notification.createdAt)}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>
    </Pressable>
  );
};
