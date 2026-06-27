import { useStyles } from "@/components/AchievementUnlockedModal/styles";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { FRAME_TIERS, FrameEffect } from "@/services/BadgeService";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

// Cosmético recém-desbloqueado a celebrar (moldura ou efeito).
export interface CosmeticUnlock {
  kind: "frame" | "effect";
  id: string;
  name: string;
}

interface Props {
  unlock: CosmeticUnlock | null;
  // Moldura atual do membro, usada como base ao prever um efeito.
  previewTier: number;
  remaining?: number;
  onClose: () => void;
}

export function CosmeticUnlockedModal({
  unlock,
  previewTier,
  remaining = 0,
  onClose,
}: Props) {
  const styles = useStyles();

  const isFrame = unlock?.kind === "frame";
  // Moldura: prévia da própria moldura. Efeito: aplica sobre a moldura atual.
  const tier = isFrame
    ? Math.max(0, FRAME_TIERS.findIndex((f) => f.id === unlock?.id))
    : previewTier;
  const effect: FrameEffect = isFrame ? "none" : ((unlock?.id ?? "none") as FrameEffect);

  return (
    <Modal
      visible={!!unlock}
      onRequestClose={onClose}
      animationType="fade"
      transparent
      presentationStyle="overFullScreen"
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.card}>
          <Text style={styles.eyebrow}>
            {isFrame ? "NOVA MOLDURA" : "NOVO EFEITO"}
          </Text>

          <View>
            <Avatar size={84} tier={tier} effect={effect} />
          </View>

          <Text style={styles.title}>{unlock?.name}</Text>
          <Text style={styles.description}>
            {isFrame
              ? "Escolha-a nas conquistas para usar no seu avatar."
              : "Ative-o nas conquistas para usar no seu avatar."}
          </Text>

          {remaining > 0 && (
            <Text style={styles.remaining}>
              +{remaining} a seguir
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
