import { CalendarModal } from "@/components/CalendarModal";
import { DateNavigator } from "@/components/DateNavigator";
import { Header } from "@/components/Header";
import { LiturgyReader, LiturgySection } from "@/components/LiturgyReader";
import { MarkReadingButton } from "@/components/MarkReadingButton";
import { LiturgyHeadSkeleton } from "@/components/Skeleton/LiturgyHeadSkeleton";
import { LiturgySkeleton } from "@/components/Skeleton/LiturgySkeleton";
import { ToastMessage } from "@/components/Toast";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { useLiturgyTTS } from "@/hooks/useLiturgyTTS";
import { LiturgyService } from "@/services/LiturgyService";
import { ReadingStreakService } from "@/services/ReadingStreakService";
import { ILiturgia, LITURGICAL_ACCENT } from "@/types/Liturgy";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { Pause, RefreshCw, Volume2 } from "lucide-react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
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

// "Terça-feira, 7 de julho" — eyebrow do cabeçalho editorial (sem o ano).
function formatEyebrowDate(date: Date): string {
  const label = date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

// Achata a liturgia nas seções exibidas como abas no leitor. Segunda Leitura e
// Oração do Dia entram só quando existem.
function buildSections(liturgy: ILiturgia): LiturgySection[] {
  const { leituras, oracoes } = liturgy;
  const sections: LiturgySection[] = [
    {
      id: "primeira-leitura",
      label: "Primeira Leitura",
      referencia: leituras.primeiraLeitura.referencia,
      titulo: leituras.primeiraLeitura.titulo,
      texto: leituras.primeiraLeitura.texto,
      formulaFinal: "Palavra do Senhor.",
      ttsText: buildSectionText(
        "Primeira leitura",
        leituras.primeiraLeitura.referencia,
        leituras.primeiraLeitura.texto,
        "Palavra do Senhor.",
      ),
    },
    {
      id: "salmo",
      label: "Salmo",
      referencia: leituras.salmo.referencia,
      refrao: leituras.salmo.refrao,
      texto: leituras.salmo.texto,
      ttsText: buildSectionText(
        "Salmo responsorial",
        leituras.salmo.referencia,
        leituras.salmo.texto,
      ),
    },
  ];

  if (leituras.segundaLeitura) {
    sections.push({
      id: "segunda-leitura",
      label: "Segunda Leitura",
      referencia: leituras.segundaLeitura.referencia,
      titulo: leituras.segundaLeitura.titulo,
      texto: leituras.segundaLeitura.texto,
      formulaFinal: "Palavra do Senhor.",
      ttsText: buildSectionText(
        "Segunda leitura",
        leituras.segundaLeitura.referencia,
        leituras.segundaLeitura.texto,
        "Palavra do Senhor.",
      ),
    });
  }

  sections.push({
    id: "evangelho",
    label: "Evangelho",
    referencia: leituras.evangelho.referencia,
    titulo: leituras.evangelho.titulo,
    texto: leituras.evangelho.texto,
    formulaFinal: "Palavra da Salvação.",
    ttsText: buildSectionText(
      "Evangelho",
      leituras.evangelho.referencia,
      leituras.evangelho.texto,
      "Palavra da Salvação.",
    ),
  });

  if (oracoes?.coleta) {
    sections.push({
      id: "oracao",
      label: "Oração do Dia",
      referencia: "",
      texto: oracoes.coleta,
      ttsText: oracoes.coleta,
    });
  }

  return sections;
}

export function ReadingsScreen() {
  const { member, updateMemberStreak } = useContext(AuthContext);
  const { colors } = useAppTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const styles = useStyles();

  const [selectedDate, setSelectedDate] = useState<Date>(today());
  const [activeSectionId, setActiveSectionId] = useState("primeira-leitura");
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liturgy, setLiturgy] = useState<ILiturgia | null>(null);
  const [error, setError] = useState(false);
  const [marking, setMarking] = useState(false);

  const {
    activeId,
    state: ttsState,
    playSection,
    pause,
    stop,
  } = useLiturgyTTS();

  const memberId = member?._id;

  const isViewingToday = isSameDay(selectedDate, today());

  // O readingStreak do backend é a única fonte de verdade sobre a leitura de
  // hoje: vale para qualquer cliente, então uma leitura marcada no browser
  // some com o botão aqui também.
  const lastReadAt = member?.readingStreak?.lastReadAt;
  const alreadyReadToday = lastReadAt
    ? isSameDay(new Date(lastReadAt), today())
    : false;
  const streakCount = member?.readingStreak?.currentStreak ?? 0;

  const handleMarkRead = useCallback(async () => {
    if (!memberId) return;
    setMarking(true);
    try {
      const streak = await ReadingStreakService.markToday();
      updateMemberStreak(streak);
      ToastMessage.success(
        "Leitura de hoje realizada",
        "Mais um dia somado à sua ofensiva.",
      );
    } catch {
      ToastMessage.error(
        "Não foi possível registrar",
        "Verifique sua conexão e tente novamente.",
      );
    } finally {
      setMarking(false);
    }
  }, [memberId, updateMemberStreak]);

  const fetchLiturgy = useCallback(async (date: Date, force = false) => {
    stop();
    setLoading(true);
    setError(false);
    try {
      const isToday = isSameDay(date, today());
      const data = isToday
        ? await LiturgyService.getToday(force)
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

  const sectionTTSProps = useCallback(
    (id: string, text: string) => ({
      ttsState: activeId === id ? ttsState : ("idle" as const),
      onTTSPlay: () => {
        playSection(id, text);
      },
      onTTSPause: pause,
    }),
    [activeId, ttsState, playSection, pause],
  );

  return (
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
            <LiturgyHeadSkeleton />
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
            <View style={styles.pageHead}>
              <Text style={styles.eyebrow}>
                Liturgia do dia · {formatEyebrowDate(selectedDate)}
              </Text>
              <Text style={styles.pageTitle}>{liturgy.liturgia}</Text>
              <View
                style={[
                  styles.colorPill,
                  { backgroundColor: LITURGICAL_ACCENT[liturgy.cor] + "29" },
                ]}
              >
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: LITURGICAL_ACCENT[liturgy.cor] },
                  ]}
                />
                <Text
                  style={[
                    styles.colorPillText,
                    { color: LITURGICAL_ACCENT[liturgy.cor] },
                  ]}
                >
                  {liturgy.cor}
                </Text>
              </View>
            </View>

            <DateNavigator
              selectedDate={selectedDate}
              onPrev={handlePrev}
              onNext={handleNext}
              onOpenCalendar={() => setCalendarVisible(true)}
              onBackToToday={handleBackToToday}
            />

            {isViewingToday && !alreadyReadToday && (
              <MarkReadingButton
                streakCount={streakCount}
                loading={marking}
                onPress={handleMarkRead}
              />
            )}

            {ttsState !== "idle" && (
              <TouchableOpacity
                onPress={ttsState === "playing" ? pause : stop}
                style={styles.ttsIndicator}
                activeOpacity={0.8}
                disabled={ttsState === "loading"}
              >
                <Volume2 size={14} color={colors.primary} />
                <Text style={styles.ttsIndicatorText}>
                  {ttsState === "loading"
                    ? "Gerando áudio..."
                    : ttsState === "playing"
                      ? "Reproduzindo áudio"
                      : "Áudio pausado"}
                </Text>
                {ttsState === "playing" ? (
                  <Pause size={14} color={colors.primary} />
                ) : (
                  <RefreshCw size={14} color={colors.primary} />
                )}
              </TouchableOpacity>
            )}

            <LiturgyReader
              sections={buildSections(liturgy)}
              activeId={activeSectionId}
              onSelectSection={setActiveSectionId}
              getTTS={sectionTTSProps}
              coachId="reading-tts-btn"
            />
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
  );
}
