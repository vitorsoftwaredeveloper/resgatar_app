import { ChevronLeft, ChevronRight, Clock } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useStyles } from "./styles";

const WEEK_ABBR = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatCenterLabel(date: Date): string {
  const label = date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

interface Props {
  selectedDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onOpenCalendar: () => void;
  onBackToToday: () => void;
}

export function DateNavigator({
  selectedDate,
  onPrev,
  onNext,
  onOpenCalendar,
  onBackToToday,
}: Props) {
  const styles = useStyles();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = isSameDay(selectedDate, today);

  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  return (
    <View style={styles.wrapper}>
      {/* Navigation row */}
      <View style={styles.navRow}>
        <Pressable style={styles.arrowBtn} onPress={onPrev} hitSlop={8}>
          <ChevronLeft size={20} color={styles.arrowIcon.color} />
        </Pressable>

        <Pressable style={styles.centerBtn} onPress={onOpenCalendar}>
          <Text style={styles.centerText}>
            {formatCenterLabel(selectedDate)}
          </Text>
        </Pressable>

        <Pressable style={styles.arrowBtn} onPress={onNext} hitSlop={8}>
          <ChevronRight size={20} color={styles.arrowIcon.color} />
        </Pressable>
      </View>

      {/* Week strip */}
      <View style={styles.weekRow}>
        {weekDays.map((day, i) => {
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDay = isSameDay(day, today);
          return (
            <Pressable
              key={i}
              style={[styles.dayCell, isSelected && styles.dayCellSelected]}
              onPress={() => {
                const diff = Math.round(
                  (day.getTime() - selectedDate.getTime()) / 86400000,
                );
                if (diff < 0) for (let j = 0; j < Math.abs(diff); j++) onPrev();
                else if (diff > 0) for (let j = 0; j < diff; j++) onNext();
              }}
              hitSlop={4}
            >
              <Text
                style={[styles.dayAbbr, isSelected && styles.dayAbbrSelected]}
              >
                {WEEK_ABBR[i]}
              </Text>
              <Text
                style={[
                  styles.dayNum,
                  isSelected && styles.dayNumSelected,
                  isTodayDay && !isSelected && styles.dayNumToday,
                ]}
              >
                {day.getDate()}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Back to today */}
      {!isToday && (
        <Pressable style={styles.backToToday} onPress={onBackToToday}>
          <Clock size={13} color={styles.backToTodayText.color} />
          <Text style={styles.backToTodayText}>Voltar para hoje</Text>
        </Pressable>
      )}
    </View>
  );
}
