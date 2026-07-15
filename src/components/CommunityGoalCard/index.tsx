import { CoachTarget } from "@/components/CoachTarget";
import { ModalSetGoal } from "@/components/ModalSetGoal";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { CommunityGoalCardSkeleton } from "@/components/Skeleton/CommunityGoalCardSkeleton";
import { ChargeServices } from "@/services/ChargeService";
import { IGoalProgress } from "@/types/Charge";
import { formatMoneyBRL } from "@/utils/helper";
import { useFocusEffect } from "@react-navigation/native";
import {
  Banknote,
  CircleCheck,
  HandHeart,
  Pencil,
  Target,
  Wallet,
} from "lucide-react-native";
import React, { useCallback, useContext, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useStyles } from "./styles";

const MONTH_LABELS = [
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

export function CommunityGoalCard() {
  const styles = useStyles();
  const { colors } = useAppTheme();
  const { sessionVersion, member } = useContext(AuthContext);
  const [progress, setProgress] = useState<IGoalProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const fetchedSessionVersion = useRef<number | null>(null);

  const isAdmin = member?.role === "admin";

  const load = useCallback(async () => {
    try {
      const data = await ChargeServices.getGoalProgress();
      setProgress(data);
    } catch {
      // Silenciosamente esconde o card: a home não deve exibir erro de meta.
      setProgress(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (fetchedSessionVersion.current === sessionVersion) return;
      fetchedSessionVersion.current = sessionVersion;
      load();
    }, [load, sessionVersion]),
  );

  // Skeleton apenas no primeiro carregamento; ao voltar à tela com dados já
  // em mãos o card permanece e é atualizado silenciosamente (sem flicker).
  if (loading && !progress) return <CommunityGoalCardSkeleton />;

  // Erro/sem dados: esconde o card (a home não deve exibir erro de meta).
  if (!progress) return null;

  // Meta não definida para o mês: estado vazio (em vez de sumir).
  if (!Number.isFinite(progress.achievedPercent)) {
    return (
      <CoachTarget id="community-goal-card">
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Meta da comunidade</Text>
          </View>
          <View style={styles.emptyState}>
            <Target size={22} color={colors.textMuted} />
            <Text style={styles.emptyText}>
              Nenhuma meta definida para este mês
            </Text>
          </View>
        </View>
      </CoachTarget>
    );
  }

  const percent = Math.max(0, Math.min(100, Math.round(progress.achievedPercent)));
  const reached = progress.goalReached;
  const monthLabel = MONTH_LABELS[progress.month - 1] ?? "";

  // Uma faixa só alimenta cor, legenda e mensagem.
  const tier = reached
    ? "reached"
    : percent >= 70
      ? "high"
      : percent >= 30
        ? "mid"
        : "low";

  const accent =
    tier === "low"
      ? colors.error
      : tier === "mid"
        ? colors.waiting
        : colors.success;

  const caption = {
    reached: "meta atingida!",
    high: "quase lá!",
    mid: "no caminho certo",
    low: "vamos começar!",
  }[tier];

  const message = {
    reached: "Obrigado a todos que contribuíram para esse resultado!",
    high: "Estamos quase lá! Poucas contribuições faltam para fecharmos o mês.",
    mid: "Estamos avançando bem — continue contribuindo para chegarmos à meta.",
    low: "Toda contribuição ajuda a comunidade a crescer — bora começar o mês forte!",
  }[tier];

  return (
    <CoachTarget id="community-goal-card">
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Meta da comunidade · {monthLabel}</Text>
          {isAdmin && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditing(true)}
              hitSlop={8}
              accessibilityLabel="Editar meta do mês"
            >
              <Pencil size={14} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.valueRow}>
          <Text style={[styles.percent, { color: accent }]}>{percent}%</Text>
          <Text style={styles.caption}>{caption}</Text>
        </View>

        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              { width: `${percent}%`, backgroundColor: accent },
            ]}
          />
        </View>

        <View style={styles.statsList}>
          <View style={styles.statRow}>
            <View style={styles.statLeft}>
              <Wallet size={16} color={colors.textMuted} />
              <Text style={styles.statLabel}>Mensalidades</Text>
            </View>
            <Text style={styles.statValue}>
              {formatMoneyBRL(progress.collected ?? 0)}
            </Text>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statLeft}>
              <HandHeart size={16} color={colors.success} />
              <Text style={styles.statLabel}>Doações</Text>
            </View>
            <Text style={[styles.statValue, { color: colors.success }]}>
              +{formatMoneyBRL(progress.donations ?? 0)}
            </Text>
          </View>

          {/* Despesas são informativas — não entram no cálculo da meta, então
              sem o "−" que sugeria subtração, mas em vermelho como valor de saída. */}
          <View style={styles.statRow}>
            <View style={styles.statLeft}>
              <Banknote size={16} color={colors.error} />
              <Text style={styles.statLabel}>Despesas</Text>
            </View>
            <Text style={[styles.statValue, { color: colors.error }]}>
              {formatMoneyBRL(progress.expenses ?? 0)}
            </Text>
          </View>
        </View>

        <View style={[styles.highlightBox, { backgroundColor: accent + "22" }]}>
          <View style={styles.highlightRow}>
            {reached ? (
              <CircleCheck size={15} color={colors.success} />
            ) : (
              <Target size={15} color={accent} />
            )}
            <Text style={styles.highlightText}>
              {reached ? (
                "Meta atingida!"
              ) : (
                <>
                  Faltam{" "}
                  <Text style={styles.remainingStrong}>{100 - percent}%</Text>{" "}
                  para a meta
                </>
              )}
            </Text>
          </View>
          <Text style={styles.highlightMessage}>{message}</Text>
        </View>
      </View>

      {isAdmin && (
        <ModalSetGoal
          visible={editing}
          onClose={() => setEditing(false)}
          onSaved={load}
          year={progress.year}
          month={progress.month}
          monthLabel={monthLabel}
          currentGoal={progress.targetGoal}
        />
      )}
    </CoachTarget>
  );
}
