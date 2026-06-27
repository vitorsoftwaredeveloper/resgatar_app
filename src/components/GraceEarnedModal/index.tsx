import { useStyles } from "@/components/AchievementUnlockedModal/styles";
import { Button } from "@/components/Button";
import { STREAK_ACCENT } from "@/components/StreakCard/styles";
import { ShieldCheck } from "lucide-react-native";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  visible: boolean;
  // Total de saves disponíveis após ganhar este.
  graceCount: number;
  onClose: () => void;
}

export function GraceEarnedModal({ visible, graceCount, onClose }: Props) {
  const styles = useStyles();

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
      transparent
      presentationStyle="overFullScreen"
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.card}>
          <Text style={styles.eyebrow}>NOVO SAVE</Text>

          <View style={styles.iconOuter}>
            <View style={styles.iconInner}>
              <ShieldCheck size={44} color={STREAK_ACCENT} />
            </View>
          </View>

          <Text style={styles.title}>Dia de graça conquistado</Text>
          <Text style={styles.description}>
            Você agora tem {graceCount} {graceCount === 1 ? "save" : "saves"}.
            Cada um perdoa uma falta e mantém sua sequência viva.
          </Text>

          <Button title="Continuar" onPress={onClose} styleCustom={styles.button} />
        </View>
      </View>
    </Modal>
  );
}
