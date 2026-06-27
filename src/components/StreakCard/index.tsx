import { IStreakData } from "@/storage/asyncStorage";
import { dayKey } from "@/services/StreakService";
import { ChevronRight, Flame } from "lucide-react-native";
import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { STREAK_ACCENT, STREAK_ACCENT_DIM, useStyles } from "./styles";

interface Props {
  data: IStreakData | null;
  onPress?: () => void;
}

const WEEKDAY_INITIALS = ["D", "S", "T", "Q", "Q", "S", "S"];

interface DayCell {
  initial: string;
  read: boolean;
  isToday: boolean;
}

// Last 7 calendar days ending today, flagged against the read history.
function buildWeek(history: string[]): DayCell[] {
  const todayKey = dayKey(new Date());
  const read = new Set(history);
  const cells: DayCell[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const key = dayKey(d);
    cells.push({
      initial: WEEKDAY_INITIALS[d.getDay()],
      read: read.has(key),
      isToday: key === todayKey,
    });
  }

  return cells;
}

export function StreakCard({ data, onPress }: Props) {
  const styles = useStyles();
  const week = useMemo(() => buildWeek(data?.history ?? []), [data?.history]);

  const current = data?.current ?? 0;
  const active = current > 0;
  const grace = data?.grace ?? 0;

  const headline = active
    ? `${current} ${current === 1 ? "dia seguido" : "dias seguidos"}`
    : data
      ? "Retome sua sequência"
      : "Comece sua sequência hoje";

  const recordText =
    data && data.best > 0
      ? `Recorde: ${data.best} ${data.best === 1 ? "dia" : "dias"}`
      : "Abra a liturgia todo dia para evoluir";

  const subtitle = grace > 0 ? `${recordText} · 🕊️ ${grace}` : recordText;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Ofensiva de leituras. ${headline}. Ver conquistas`}
    >
      <Text style={styles.label}>OFENSIVA DE LEITURAS</Text>

      <View style={styles.row}>
        <View style={styles.left}>
          <View style={[styles.flameWrap, !active && styles.flameWrapDim]}>
            <Flame
              size={22}
              color={active ? STREAK_ACCENT : STREAK_ACCENT_DIM}
              fill={active ? STREAK_ACCENT : "transparent"}
            />
          </View>
          <View style={styles.texts}>
            <Text style={styles.headline}>{headline}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        <View style={styles.right}>
          <View style={styles.week}>
            {week.map((cell, i) => (
              <View key={i} style={styles.dayCol}>
                <Text style={styles.dayInitial}>{cell.initial}</Text>
                <View
                  style={[
                    styles.dot,
                    cell.read && styles.dotRead,
                    cell.isToday && !cell.read && styles.dotToday,
                  ]}
                />
              </View>
            ))}
          </View>
          {!!onPress && <ChevronRight size={18} color={STREAK_ACCENT_DIM} />}
        </View>
      </View>
    </TouchableOpacity>
  );
}
