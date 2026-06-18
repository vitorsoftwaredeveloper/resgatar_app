import { ChevronLeft, ChevronRight, Clock } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { useStyles } from "./styles";

const WEEK_HEADER = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const { height: SCREEN_H } = Dimensions.get("window");

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildCalendarGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const grid: (Date | null)[] = [];

  // leading days from previous month
  for (let i = 0; i < firstDay.getDay(); i++) {
    const d = new Date(year, month, -firstDay.getDay() + i + 1);
    grid.push(d);
  }
  // days of current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    grid.push(new Date(year, month, d));
  }
  // trailing days from next month
  const remaining = 7 - (grid.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      grid.push(new Date(year, month + 1, d));
    }
  }
  return grid;
}

interface Props {
  visible: boolean;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
}

export function CalendarModal({
  visible,
  selectedDate,
  onSelectDate,
  onClose,
}: Props) {
  const styles = useStyles();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());
  const slideAnim = useRef(new Animated.Value(SCREEN_H)).current;

  useEffect(() => {
    if (visible) {
      setViewYear(selectedDate.getFullYear());
      setViewMonth(selectedDate.getMonth());
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 180,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_H,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const grid = buildCalendarGrid(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const handleSelectDay = (date: Date) => {
    onSelectDate(new Date(date));
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable testID="calendar-backdrop" style={styles.backdrop} onPress={onClose} />
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
      >
        {/* Handle */}
        <View style={styles.handle} />

        {/* Month header */}
        <View style={styles.monthHeader}>
          <Pressable testID="prev-month" style={styles.monthArrow} onPress={prevMonth} hitSlop={8}>
            <ChevronLeft size={18} color={styles.monthArrowIcon.color} />
          </Pressable>
          <Text testID="month-title" style={styles.monthTitle}>
            {MONTH_NAMES[viewMonth]} {viewYear}
          </Text>
          <Pressable testID="next-month" style={styles.monthArrow} onPress={nextMonth} hitSlop={8}>
            <ChevronRight size={18} color={styles.monthArrowIcon.color} />
          </Pressable>
        </View>

        {/* Week header */}
        <View style={styles.weekHeader}>
          {WEEK_HEADER.map((d, i) => (
            <Text key={i} style={styles.weekHeaderText}>
              {d}
            </Text>
          ))}
        </View>

        {/* Day grid */}
        <View style={styles.grid}>
          {grid.map((date, i) => {
            if (!date) return <View key={i} style={styles.gridCell} />;
            const isCurrentMonth = date.getMonth() === viewMonth;
            const isSelected = isSameDay(date, selectedDate);
            const isTodayDate = isSameDay(date, today);
            return (
              <Pressable
                key={i}
                style={styles.gridCell}
                onPress={() => handleSelectDay(date)}
                disabled={!isCurrentMonth}
              >
                <View
                  style={[
                    styles.dayCircle,
                    isSelected && styles.dayCircleSelected,
                    isTodayDate && !isSelected && styles.dayCircleToday,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      !isCurrentMonth && styles.dayTextOtherMonth,
                      isSelected && styles.dayTextSelected,
                      isTodayDate && !isSelected && styles.dayTextToday,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable
            testID="today-btn"
            style={styles.todayBtn}
            onPress={() => handleSelectDay(today)}
          >
            <Clock size={14} color={styles.todayBtnText.color} />
            <Text style={styles.todayBtnText}>Hoje</Text>
          </Pressable>
          <Pressable testID="close-btn" style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Fechar</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
}
