import { CoachTarget } from "@/components/CoachTarget";
import { AuthContext } from "@/context/AuthContext";
import { IMember } from "@/types/Member";
import { Flame } from "lucide-react-native";
import React, { useContext, useMemo } from "react";
import { Text, View } from "react-native";
import { STREAK_ACCENT, STREAK_ACCENT_DIM, useStyles } from "./styles";

type ReadingStreak = NonNullable<IMember["readingStreak"]>;

const WEEKDAY_INITIALS = ["D", "S", "T", "Q", "Q", "S", "S"];

interface DayCell {
  initial: string;
  read: boolean;
  isToday: boolean;
}

// Reconstrói os 7 dias da semana a partir de currentStreak + lastReadAt.
// Dias dentro da janela do streak são marcados como lidos.
function buildWeek(streak: ReadingStreak | null | undefined): DayCell[] {
  const cells: DayCell[] = [];
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const current = streak?.currentStreak ?? 0;

  // Última data lida como objeto Date
  let lastReadDate: Date | null = null;
  if (streak?.lastReadAt) {
    const [y, m, d] = streak.lastReadAt.split("-").map(Number);
    lastReadDate = new Date(y, m - 1, d);
  }

  for (let i = 6; i >= 0; i--) {
    const d = new Date(todayDate);
    d.setDate(d.getDate() - i);
    const isToday = i === 0;

    let read = false;
    if (lastReadDate && current > 0) {
      // Dias dentro do streak contados a partir do último dia lido
      const diffFromLastRead = Math.round(
        (lastReadDate.getTime() - d.getTime()) / 86_400_000,
      );
      read = diffFromLastRead >= 0 && diffFromLastRead < current;
    }

    cells.push({ initial: WEEKDAY_INITIALS[d.getDay()], read, isToday });
  }

  return cells;
}

export function StreakCard() {
  const styles = useStyles();
  const { member } = useContext(AuthContext);
  const data = member?.readingStreak;

  const week = useMemo(() => buildWeek(data), [data]);

  const current = data?.currentStreak ?? 0;
  const active = current > 0;

  const headline = active
    ? `${current} ${current === 1 ? "dia seguido" : "dias seguidos"}`
    : data
      ? "Retome sua sequência"
      : "Comece sua sequência hoje";

  const recordText =
    data && data.longestStreak > 0
      ? `Recorde: ${data.longestStreak} ${data.longestStreak === 1 ? "dia" : "dias"}`
      : "Abra a liturgia todo dia para evoluir";

  return (
    <CoachTarget id="streak-card">
    <View
      style={styles.container}
      accessibilityLabel={`Ofensiva de leituras. ${headline}`}
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
            <Text style={styles.subtitle}>{recordText}</Text>
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
        </View>
      </View>
    </View>
    </CoachTarget>
  );
}
