import { CalendarModal } from "@/components/CalendarModal";
import { DateNavigator } from "@/components/DateNavigator";
import { Header } from "@/components/Header";
import { LiturgySeasonBanner } from "@/components/LiturgySeasonBanner";
import { PsalmCard } from "@/components/PsalmCard";
import { ReadingCard } from "@/components/ReadingCard";
import { LiturgySkeleton } from "@/components/Skeleton/LiturgySkeleton";
import { SwipeableTab } from "@/components/SwipeableTab";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { LiturgyService } from "@/services/LiturgyService";
import { ILiturgia } from "@/types/Liturgy";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { RefreshCw } from "lucide-react-native";
import React, { useCallback, useContext, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useStyles } from "./styles";

function today(): Date {
  const d = new Date();
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

export function DashboardScreen() {
  const { member } = useContext(AuthContext);
  const { colors } = useAppTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const styles = useStyles();

  const [selectedDate, setSelectedDate] = useState<Date>(today());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liturgy, setLiturgy] = useState<ILiturgia | null>(null);
  const [error, setError] = useState(false);

  const fetchLiturgy = useCallback(async (date: Date) => {
    setLoading(true);
    setError(false);
    try {
      const data = isSameDay(date, today())
        ? await LiturgyService.getToday()
        : await LiturgyService.getByDate(date);
      setLiturgy(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchLiturgy(selectedDate);
    }, [selectedDate]),
  );

  const handlePrev = useCallback(() => {
    setSelectedDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() - 1);
      return next;
    });
  }, []);

  const handleNext = useCallback(() => {
    setSelectedDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      return next;
    });
  }, []);

  const handleBackToToday = useCallback(() => {
    setSelectedDate(today());
  }, []);

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  return (
    <SwipeableTab>
      <View style={styles.container}>
        <Header name={`${member?.firstName} ${member?.lastName}`} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: tabBarHeight + 70 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <>
              <DateNavigator
                selectedDate={selectedDate}
                onPrev={handlePrev}
                onNext={handleNext}
                onOpenCalendar={() => setCalendarVisible(true)}
                onBackToToday={handleBackToToday}
              />
              <LiturgySkeleton />
            </>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Não foi possível carregar</Text>
              <Text style={styles.errorSubtitle}>
                Verifique sua conexão e tente novamente.
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => fetchLiturgy(selectedDate)}
              >
                <RefreshCw size={16} color={colors.primary} />
                <Text style={styles.retryText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : liturgy ? (
            <>
              <DateNavigator
                selectedDate={selectedDate}
                onPrev={handlePrev}
                onNext={handleNext}
                onOpenCalendar={() => setCalendarVisible(true)}
                onBackToToday={handleBackToToday}
              />

              <LiturgySeasonBanner
                liturgia={liturgy.liturgia}
                data={liturgy.data}
                cor={liturgy.cor}
              />

              <ReadingCard
                testID="card-primeira-leitura"
                label="PRIMEIRA LEITURA"
                referencia={liturgy.leituras.primeiraLeitura.referencia}
                titulo={liturgy.leituras.primeiraLeitura.titulo}
                texto={liturgy.leituras.primeiraLeitura.texto}
                formulaFinal="Palavra do Senhor."
              />

              <PsalmCard
                testID="card-salmo"
                referencia={liturgy.leituras.salmo.referencia}
                refrao={liturgy.leituras.salmo.refrao}
                texto={liturgy.leituras.salmo.texto}
              />

              {!!liturgy.leituras.segundaLeitura && (
                <ReadingCard
                  testID="card-segunda-leitura"
                  label="SEGUNDA LEITURA"
                  referencia={liturgy.leituras.segundaLeitura.referencia}
                  titulo={liturgy.leituras.segundaLeitura.titulo}
                  texto={liturgy.leituras.segundaLeitura.texto}
                  formulaFinal="Palavra do Senhor."
                />
              )}

              <ReadingCard
                testID="card-evangelho"
                label="✝  EVANGELHO"
                referencia={liturgy.leituras.evangelho.referencia}
                titulo={liturgy.leituras.evangelho.titulo}
                texto={liturgy.leituras.evangelho.texto}
                formulaFinal="Palavra da Salvação."
              />

              {!!liturgy.oracoes?.coleta && (
                <ReadingCard
                  testID="card-oracao"
                  label="ORAÇÃO DO DIA"
                  referencia=""
                  texto={liturgy.oracoes.coleta}
                />
              )}
            </>
          ) : null}
        </ScrollView>
        <CalendarModal
          visible={calendarVisible}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          onClose={() => setCalendarVisible(false)}
        />
      </View>
    </SwipeableTab>
  );
}
