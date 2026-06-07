import { ILiturgia, LITURGICAL_ACCENT } from "@/types/Liturgy";
import { formatLiturgicalDate } from "@/utils/helper";
import React from "react";
import { Text, View } from "react-native";
import { useStyles } from "./styles";

interface Props {
  liturgia: string;
  data: string;
  cor: ILiturgia["cor"];
  tipo?: string;
}

export function LiturgySeasonBanner({ liturgia, data, cor, tipo }: Props) {
  const styles = useStyles();
  const accent = LITURGICAL_ACCENT[cor];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>LITURGIA DO DIA</Text>
        {tipo ? (
          <View style={[styles.badge, { borderColor: accent }]}>
            <Text style={[styles.badgeText, { color: accent }]}>
              {tipo.toUpperCase()}
            </Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.title}>{liturgia}</Text>

      <View style={styles.footer}>
        <Text style={styles.date}>{formatLiturgicalDate(data)}</Text>
        <View style={[styles.dot, { backgroundColor: accent }]} />
        <Text style={styles.colorName}>{cor}</Text>
      </View>
    </View>
  );
}
