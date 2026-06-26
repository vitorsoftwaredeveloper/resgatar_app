import { Avatar } from "@/components/Avatar";
import { Header } from "@/components/Header";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { ChargeServices } from "@/services/ChargeService";
import { IChargeSummary, IChargeSummaryMember } from "@/types/Charge";
import { formatDateFromTimestamp, formatMoneyBRL } from "@/utils/helper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  Banknote,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  QrCode,
  Target,
} from "lucide-react-native";
import React, { useCallback, useContext, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ToastMessage } from "@/components/Toast";
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

type Tab = "paid" | "pending";

export function ArrecadacaoScreen() {
  const navigation = useNavigation();
  const styles = useStyles();
  const { colors } = useAppTheme();
  const { member } = useContext(AuthContext);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [tab, setTab] = useState<Tab>("paid");
  const [summary, setSummary] = useState<IChargeSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Não permite navegar para meses futuros (não há arrecadação a mostrar).
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // `month` no estado é 0-indexado (Date.getMonth); o endpoint usa 1–12.
      const data = await ChargeServices.getSummary(year, month + 1);
      setSummary(data);
    } catch {
      setSummary(null);
      ToastMessage.error("Erro", "Não foi possível carregar a arrecadação.");
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  function goToPreviousMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (isCurrentMonth) return;
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  const progress = useMemo(() => {
    if (!summary || summary.goal <= 0) return 0;
    return Math.min(summary.collected / summary.goal, 1);
  }, [summary]);

  const members = useMemo(() => {
    if (!summary) return [];
    return summary.members.filter((m) => (tab === "paid" ? m.paid : !m.paid));
  }, [summary, tab]);

  function renderMember({ item }: { item: IChargeSummaryMember }) {
    const methodLabel = item.method === "cash" ? "Dinheiro" : "PIX";
    return (
      <View style={styles.memberCard}>
        <Avatar photo={item.photo} size={40} />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.memberMeta} numberOfLines={1}>
            {item.paid
              ? `Pago em ${formatDateFromTimestamp(
                  item.paidAt ? new Date(item.paidAt).getTime() : undefined,
                )} · ${methodLabel}`
              : "Pagamento pendente"}
          </Text>
        </View>
        <Text style={styles.memberValue}>{formatMoneyBRL(item.amount)}</Text>
      </View>
    );
  }

  const header = summary ? (
    <View style={{ gap: styles.list.gap }}>
      <View style={styles.monthSelector}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={goToPreviousMonth}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Mês anterior"
        >
          <ChevronLeft size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.monthLabel}>
          {MONTH_LABELS[month]} {year}
        </Text>
        <TouchableOpacity
          style={[styles.navButton, isCurrentMonth && styles.navButtonDisabled]}
          onPress={goToNextMonth}
          disabled={isCurrentMonth}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Próximo mês"
        >
          <ChevronRight size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.metaLabel}>Meta do mês</Text>
          <Text style={styles.metaPercent}>{Math.round(progress * 100)}%</Text>
        </View>
        <View style={styles.metaValueRow}>
          <Text style={styles.metaCollected}>
            {formatMoneyBRL(summary.collected)}
          </Text>
          <Text style={styles.metaGoal}>/ {formatMoneyBRL(summary.goal)}</Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>
        <View style={styles.remainingRow}>
          {summary.goal <= 0 ? (
            <>
              <Target size={16} color={colors.textMuted} />
              <Text style={styles.metaLabel}>
                Nenhuma contribuição prevista neste mês.
              </Text>
            </>
          ) : summary.remaining > 0 ? (
            <>
              <Target size={16} color={colors.primary} />
              <Text style={styles.remainingText}>
                Falta{" "}
                <Text style={styles.remainingStrong}>
                  {formatMoneyBRL(summary.remaining)}
                </Text>{" "}
                para a meta
              </Text>
            </>
          ) : (
            <>
              <CircleCheck size={16} color={colors.success} />
              <Text style={styles.goalReachedText}>Meta atingida!</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.metricGrid}>
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <QrCode size={16} color={colors.info} />
            <Text style={styles.metricLabel}>PIX</Text>
          </View>
          <Text style={styles.metricValue}>
            {formatMoneyBRL(summary.byMethod.pix)}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Banknote size={16} color={colors.success} />
            <Text style={styles.metricLabel}>Dinheiro</Text>
          </View>
          <Text style={styles.metricValue}>
            {formatMoneyBRL(summary.byMethod.cash)}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <CircleCheck size={16} color={colors.success} />
            <Text style={styles.metricLabel}>Pagaram</Text>
          </View>
          <Text style={styles.metricValue}>
            {summary.counts.paid}{" "}
            <Text style={styles.metricValueSuffix}>
              de {summary.counts.total}
            </Text>
          </Text>
        </View>
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <CircleAlert size={16} color={colors.error} />
            <Text style={styles.metricLabel}>Inadimplentes</Text>
          </View>
          <Text style={styles.metricValue}>{summary.counts.pending}</Text>
        </View>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, tab === "paid" && styles.tabActive]}
          onPress={() => setTab("paid")}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.tabText, tab === "paid" && styles.tabTextActive]}
          >
            Pagaram ({summary.counts.paid})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === "pending" && styles.tabActive]}
          onPress={() => setTab("pending")}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.tabText, tab === "pending" && styles.tabTextActive]}
          >
            Inadimplentes ({summary.counts.pending})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : null;

  return (
    <View style={styles.container}>
      <Header
        name={member?.firstName + " " + member?.lastName}
        photo={member?.profileImage}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <Text style={styles.screenTitle}>Entrada mensal</Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 32 }}
          />
        ) : !summary ? (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>
              Não foi possível carregar a arrecadação.
            </Text>
          </View>
        ) : (
          <FlatList
            data={members}
            keyExtractor={(item) => item.id}
            renderItem={renderMember}
            ListHeaderComponent={header}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.centered}>
                <Text style={styles.emptyText}>
                  {tab === "paid"
                    ? "Ninguém pagou ainda neste mês."
                    : "Nenhum inadimplente neste mês."}
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}
