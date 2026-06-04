import { ILiturgia, LITURGICAL_ACCENT, LITURGICAL_BG } from "@/types/Liturgy";
import { formatLiturgicalDate } from "@/utils/helper";
import React from "react";
import { Text, View } from "react-native";
import { useStyles } from "./styles";

interface Props {
  liturgia: string;
  data: string;
  cor: ILiturgia["cor"];
}

export function LiturgySeasonBanner({ liturgia, data, cor }: Props) {
  const styles = useStyles();
  const accent = LITURGICAL_ACCENT[cor];
  const bg = LITURGICAL_BG[cor];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: styles.container.backgroundColor,
          borderLeftColor: accent,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <View style={styles.textBlock}>
        <Text style={[styles.season, { color: accent }]} ellipsizeMode="tail">
          {liturgia}
        </Text>
        <Text style={styles.date} ellipsizeMode="tail">
          {formatLiturgicalDate(data)}
        </Text>
      </View>
    </View>
  );
}
