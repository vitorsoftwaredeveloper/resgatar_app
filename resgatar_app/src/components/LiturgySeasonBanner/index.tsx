import React from "react";
import { View, Text } from "react-native";
import { ILiturgia, LITURGICAL_ACCENT, LITURGICAL_BG } from "@/types/Liturgy";
import { formatLiturgicalDate } from "@/utils/helper";
import { styles } from "./styles";

interface Props {
  liturgia: string;
  data: string;
  cor: ILiturgia["cor"];
}

export function LiturgySeasonBanner({ liturgia, data, cor }: Props) {
  const accent = LITURGICAL_ACCENT[cor];
  const bg = LITURGICAL_BG[cor];

  return (
    <View style={[styles.container, { backgroundColor: bg, borderLeftColor: accent }]}>
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <View style={styles.textBlock}>
        <Text style={[styles.season, { color: accent }]}>{liturgia}</Text>
        <Text style={styles.date}>{formatLiturgicalDate(data)}</Text>
      </View>
    </View>
  );
}
