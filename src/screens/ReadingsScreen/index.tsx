import { CalendarModal } from "@/components/CalendarModal";
import { GraceEarnedModal } from "@/components/GraceEarnedModal";
import { DateNavigator } from "@/components/DateNavigator";
import { Header } from "@/components/Header";
import { LiturgySeasonBanner } from "@/components/LiturgySeasonBanner";
import { PsalmCard } from "@/components/PsalmCard";
import { ReadingCard } from "@/components/ReadingCard";
import { LiturgySkeleton } from "@/components/Skeleton/LiturgySkeleton";
import { SwipeableTab } from "@/components/SwipeableTab";
import { ToastMessage } from "@/components/Toast";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { useLiturgyTTS } from "@/hooks/useLiturgyTTS";
import { LiturgyService } from "@/services/LiturgyService";
import { StreakService } from "@/services/StreakService";
import { ILiturgia } from "@/types/Liturgy";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { RefreshCw } from "lucide-react-native";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
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

function buildSectionText(
  titulo: string,
  referencia: string,
  texto: string,
  formulaFinal?: string,
): string {
  return [titulo, referencia, texto, formulaFinal].filter(Boolean).join(". ");
}

export function ReadingsScreen() {
  const { member, notifyUnlocks } = useContext(AuthContext);
  const { colors } = useAppTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const styles = useStyles();

  const [selectedDate, setSelectedDate] = useState<Date>(today());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liturgy, setLiturgy] = useState<ILiturgia | null>(null);
  const [error, setError] = useState(false);
  // Saves disponíveis após ganhar um (controla a modal de "novo save").
  const [graceEarned, setGraceEarned] = useState<number | null>(null);

  const {
    activeId,
    state: ttsState,
    playSection,
    pause,
    stop,
  } = useLiturgyTTS();

  const memberId = member?._id;
  const isToday = isSameDay(selectedDate, today());

  // Seções abertas no dia atual — quando 1ª leitura + salmo + evangelho estão
  // todas abertas, conta como "leitura completa". Reinicia ao trocar de data.
  const expandedSections = useRef<Set<string>>(new Set());
  useEffect(() => {
    expandedSections.current = new Set();
  }, [selectedDate]);

  const handleAudioListen = useCallback(async () => {
    if (!memberId) return;
    const newBadges = await StreakService.recordAudioListen(memberId);
    if (newBadges.length > 0) await notifyUnlocks(newBadges);
  }, [memberId, notifyUnlocks]);

  const handleSectionExpand = useCallback(
    async (id: string) => {
      // Só conta para a liturgia de hoje; navegar no passado não pontua.
      if (!memberId || !isToday) return;
      expandedSections.current.add(id);
      const done = ["primeira-leitura", "salmo", "evangelho"].every((s) =>
        expandedSections.current.has(s),
      );
      if (!done) return;
      const beforeEight = new Date().getHours() < 8;
      const newBadges = await StreakService.recordCompleteReading(
        memberId,
        beforeEight,
      );
      if (newBadges.length > 0) await notifyUnlocks(newBadges);
    },
    [memberId, isToday, notifyUnlocks],
  );

  // Reading TODAY's liturgy is the single event that advances the streak. It
  // lives here (not on Início) so merely opening the app never counts as a read.
  const markStreak = useCallback(async () => {
    if (!memberId) return;
    const result = await StreakService.recordRead(memberId);

    if (result.newBadges.length > 0) {
      // Conquistas viram modal de celebração (global, via contexto); isso
      // também atualiza moldura/efeito e avisa cosméticos desbloqueados.
      await notifyUnlocks(result.newBadges);
    } else if (result.milestone) {
      ToastMessage.success(
        `🔥 ${result.milestone} dias de liturgia!`,
        "Sua constância está acendendo.",
      );
    } else if (result.newRecord) {
      ToastMessage.success(
        `Novo recorde! 🔥 ${result.data.current} dias`,
        "Você nunca chegou tão longe.",
      );
    } else if (result.graceUsed) {
      ToastMessage.success(
        "🕊️ Dia de graça usado",
        "Você faltou um dia, mas sua sequência continua viva.",
      );
    } else if (result.graceEarned) {
      // Um save conquistado ganha uma modal de celebração (≠ toast).
      setGraceEarned(result.data.grace);
    } else if (result.countedToday) {
      // Ordinary day: still confirm the streak advanced. Fires only on the
      // first read of the day (countedToday is false on re-opens).
      ToastMessage.success(
        `🔥 +1 dia de ofensiva!`,
        `Você está há ${result.data.current} dias seguidos de leitura.`,
      );
    }
  }, [memberId, notifyUnlocks]);

  const fetchLiturgy = useCallback(
    async (date: Date, force = false) => {
      stop();
      setLoading(true);
      setError(false);
      try {
        const isToday = isSameDay(date, today());
        const data = isToday
          ? await LiturgyService.getToday(force)
          : await LiturgyService.getByDate(date);
        setLiturgy(data);
        if (isToday) markStreak();
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [markStreak],
  );

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

  const sectionTTSProps = useCallback(
    (id: string, text: string) => ({
      ttsState: activeId === id ? ttsState : ("idle" as const),
      onTTSPlay: () => {
        playSection(id, text);
        handleAudioListen();
      },
      onTTSPause: pause,
    }),
    [activeId, ttsState, playSection, pause, handleAudioListen],
  );

  return (
    <SwipeableTab>
      <View style={styles.container}>
        <Header
          name={`${member?.firstName} ${member?.lastName}`}
          photo={member?.profileImage}
        />

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
                onPress={() => fetchLiturgy(selectedDate, true)}
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
                onExpand={() => handleSectionExpand("primeira-leitura")}
                {...sectionTTSProps(
                  "primeira-leitura",
                  buildSectionText(
                    "Primeira leitura",
                    liturgy.leituras.primeiraLeitura.referencia,
                    liturgy.leituras.primeiraLeitura.texto,
                    "Palavra do Senhor.",
                  ),
                )}
              />

              <PsalmCard
                testID="card-salmo"
                referencia={liturgy.leituras.salmo.referencia}
                refrao={liturgy.leituras.salmo.refrao}
                texto={liturgy.leituras.salmo.texto}
                onExpand={() => handleSectionExpand("salmo")}
                {...sectionTTSProps(
                  "salmo",
                  buildSectionText(
                    "Salmo responsorial",
                    liturgy.leituras.salmo.referencia,
                    liturgy.leituras.salmo.texto,
                  ),
                )}
              />

              {!!liturgy.leituras.segundaLeitura && (
                <ReadingCard
                  testID="card-segunda-leitura"
                  label="SEGUNDA LEITURA"
                  referencia={liturgy.leituras.segundaLeitura.referencia}
                  titulo={liturgy.leituras.segundaLeitura.titulo}
                  texto={liturgy.leituras.segundaLeitura.texto}
                  formulaFinal="Palavra do Senhor."
                  {...sectionTTSProps(
                    "segunda-leitura",
                    buildSectionText(
                      "Segunda leitura",
                      liturgy.leituras.segundaLeitura.referencia,
                      liturgy.leituras.segundaLeitura.texto,
                      "Palavra do Senhor.",
                    ),
                  )}
                />
              )}

              <ReadingCard
                testID="card-evangelho"
                label="EVANGELHO"
                referencia={liturgy.leituras.evangelho.referencia}
                titulo={liturgy.leituras.evangelho.titulo}
                texto={liturgy.leituras.evangelho.texto}
                formulaFinal="Palavra da Salvação."
                onExpand={() => handleSectionExpand("evangelho")}
                {...sectionTTSProps(
                  "evangelho",
                  buildSectionText(
                    "Evangelho",
                    liturgy.leituras.evangelho.referencia,
                    liturgy.leituras.evangelho.texto,
                    "Palavra da Salvação.",
                  ),
                )}
              />

              {!!liturgy.oracoes?.coleta && (
                <ReadingCard
                  testID="card-oracao"
                  label="ORAÇÃO DO DIA"
                  referencia=""
                  texto={liturgy.oracoes.coleta}
                  {...sectionTTSProps("oracao", liturgy.oracoes.coleta)}
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
        <GraceEarnedModal
          visible={graceEarned !== null}
          graceCount={graceEarned ?? 0}
          onClose={() => setGraceEarned(null)}
        />
      </View>
    </SwipeableTab>
  );
}
