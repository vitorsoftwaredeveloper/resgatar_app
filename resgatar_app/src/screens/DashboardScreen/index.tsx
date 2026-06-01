import React, { useContext, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { RefreshCw } from "lucide-react-native";
import { AuthContext } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { LiturgySeasonBanner } from "@/components/LiturgySeasonBanner";
import { ReadingCard } from "@/components/ReadingCard";
import { PsalmCard } from "@/components/PsalmCard";
import { LiturgySkeleton } from "@/components/Skeleton/LiturgySkeleton";
import { LiturgyService } from "@/services/LiturgyService";
import { ILiturgia, LITURGICAL_ACCENT } from "@/types/Liturgy";
import { COLORS } from "@/theme";
import { styles } from "./styles";

export function DashboardScreen() {
  const { member } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [liturgy, setLiturgy] = useState<ILiturgia | null>(null);
  const [error, setError] = useState(false);

  const fetchLiturgy = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await LiturgyService.getToday();
      setLiturgy(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchLiturgy(); }, []));

  const accent = liturgy ? LITURGICAL_ACCENT[liturgy.cor] ?? COLORS.primary : COLORS.primary;

  return (
    <SafeAreaView style={styles.container}>
      <Header name={`${member?.firstName} ${member?.lastName}`} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <LiturgySkeleton />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Não foi possível carregar</Text>
            <Text style={styles.errorSubtitle}>
              Verifique sua conexão e tente novamente.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchLiturgy}>
              <RefreshCw size={16} color={COLORS.primary} />
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : liturgy ? (
          <>
            <LiturgySeasonBanner
              liturgia={liturgy.liturgia}
              data={liturgy.data}
              cor={liturgy.cor}
            />

            <ReadingCard
              label="PRIMEIRA LEITURA"
              referencia={liturgy.leituras.primeiraLeitura.referencia}
              titulo={liturgy.leituras.primeiraLeitura.titulo}
              texto={liturgy.leituras.primeiraLeitura.texto}
              accentColor={accent}
            />

            <PsalmCard
              referencia={liturgy.leituras.salmo.referencia}
              refrao={liturgy.leituras.salmo.refrao}
              texto={liturgy.leituras.salmo.texto}
              accentColor={accent}
            />

            {!!liturgy.leituras.segundaLeitura && (
              <ReadingCard
                label="SEGUNDA LEITURA"
                referencia={liturgy.leituras.segundaLeitura.referencia}
                titulo={liturgy.leituras.segundaLeitura.titulo}
                texto={liturgy.leituras.segundaLeitura.texto}
                accentColor={accent}
              />
            )}

            <ReadingCard
              label="✝  EVANGELHO"
              referencia={liturgy.leituras.evangelho.referencia}
              titulo={liturgy.leituras.evangelho.titulo}
              texto={liturgy.leituras.evangelho.texto}
              accentColor={accent}
              isGospel
            />

            {!!liturgy.oracoes?.coleta && (
              <ReadingCard
                label="ORAÇÃO DO DIA"
                referencia=""
                texto={liturgy.oracoes.coleta}
                accentColor={accent}
              />
            )}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
