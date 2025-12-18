import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";

export function HighlightCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Quem conecta amigo é indicou, assinou, ganhou!
      </Text>

      <Text style={styles.description}>
        Indique amigos e ganhe descontos especiais nas suas contribuições.
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Indicar agora</Text>
      </TouchableOpacity>
    </View>
  );
}
