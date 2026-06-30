import { Flame } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { useStyles } from "./styles";

interface Props {
  /** Sequência atual (reservado para uso futuro no texto). */
  streakCount?: number;
  /** Em andamento (durante a chamada ao backend). */
  loading?: boolean;
  onPress: () => void;
}

export function MarkReadingButton({ loading = false, onPress }: Props) {
  const styles = useStyles();

  return (
    <TouchableOpacity
      style={styles.cta}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={loading}
      accessibilityRole="button"
      accessibilityLabel="Marcar como lida?"
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <Flame size={15} color="#FFFFFF" />
      )}
      <Text style={styles.ctaTitle}>Marcar como lida?</Text>
    </TouchableOpacity>
  );
}
