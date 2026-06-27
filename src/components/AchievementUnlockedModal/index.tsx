import { Button } from "@/components/Button";
import { badgeIcon } from "@/components/AchievementsModal/badgeIcons";
import { STREAK_ACCENT } from "@/components/StreakCard/styles";
import { BadgeDefinition } from "@/services/BadgeService";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useStyles } from "./styles";

interface Props {
  // The badge to celebrate, or null when nothing is queued.
  badge: BadgeDefinition | null;
  // Number of further unlocks still waiting behind this one.
  remaining?: number;
  onClose: () => void;
}

export function AchievementUnlockedModal({
  badge,
  remaining = 0,
  onClose,
}: Props) {
  const styles = useStyles();
  const Icon = badge ? badgeIcon(badge.iconId) : null;

  return (
    <Modal
      visible={!!badge}
      onRequestClose={onClose}
      animationType="fade"
      transparent
      presentationStyle="overFullScreen"
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.card}>
          <Text style={styles.eyebrow}>CONQUISTA DESBLOQUEADA</Text>

          <View style={styles.iconOuter}>
            <View style={styles.iconInner}>
              {Icon && <Icon size={44} color={STREAK_ACCENT} />}
            </View>
          </View>

          <Text style={styles.title}>{badge?.title}</Text>
          <Text style={styles.description}>{badge?.description}</Text>

          {remaining > 0 && (
            <Text style={styles.remaining}>
              +{remaining} conquista{remaining > 1 ? "s" : ""} a seguir
            </Text>
          )}

          <Button
            title={remaining > 0 ? "Próxima" : "Continuar"}
            onPress={onClose}
            styleCustom={styles.button}
          />
        </View>
      </View>
    </Modal>
  );
}
