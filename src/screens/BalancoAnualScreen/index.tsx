import { Avatar } from "@/components/Avatar";
import { Header } from "@/components/Header";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { BalanceServices } from "@/services/BalanceService";
import { ChargeServices } from "@/services/ChargeService";
import { IAnnualBalance, IAnnualBalanceMonth } from "@/types/Balance";
import {
  IAnnualByMember,
  IAnnualByMonth,
  IAnnualSummary,
} from "@/types/Charge";
import { formatMoneyBRL } from "@/utils/helper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Banknote,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  FileDown,
  QrCode,
  Target,
  Wallet,
} from "lucide-react-native";
import { shareBalanceReportPDF } from "@/utils/generateBalanceReport";
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

type Tab = "months" | "members";

export function BalancoAnualScreen() {
  const navigation = useNavigation();
  const styles = useStyles();
  const { colors, mode } = useAppTheme();
  const { member } = useContext(AuthContext);
  const [exporting, setExporting] = useState(false);

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [tab, setTab] = useState<Tab>("months");
  const [summary, setSummary] = useState<IAnnualSummary | null>(null);
  const [balance, setBalance] = useState<IAnnualBalance | null>(null);
  const [loading, setLoading] = useState(true);

  // Não há balanço a mostrar para anos futuros.
  const isCurrentYear = year === currentYear;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Arrecadação detalhada (meta/membros) + balanço (entradas x saídas).
      const [summaryData, balanceData] = await Promise.all([
        ChargeServices.getAnnualSummary(year),
        BalanceServices.getAnnual(year),
      ]);
      setSummary(summaryData);
      setBalance(balanceData);
    } catch {
      setSummary(null);
      setBalance(null);
      ToastMessage.error("Erro", "Não foi possível carregar o balanço anual.");
    } finally {
      setLoading(false);
    }
  }, [year]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const progress = useMemo(() => {
    if (!summary || summary.totals.goal <= 0) return 0;
    return Math.min(summary.totals.collected / summary.totals.goal, 1);
  }, [summary]);

  // Saídas/saldo por mês, indexados por mês (1-12) para cruzar no renderMonth.
  const balanceByMonth = useMemo(
    () =>
      new Map<number, IAnnualBalanceMonth>(
        (balance?.byMonth ?? []).map((m) => [m.month, m]),
      ),
    [balance],
  );

  const handleExport = useCallback(async () => {
    if (!balance || exporting) return;
    setExporting(true);
    try {
      await shareBalanceReportPDF({ balance, isCurrentYear, themeMode: mode });
    } catch {
      ToastMessage.error("Erro", "Não foi possível gerar o PDF do balanço.");
    } finally {
      setExporting(false);
    }
  }, [balance, exporting, isCurrentYear, mode]);

  // Rótulo do corte: ano corrente acumula até o mês atual; anos passados fecham.
  const cutoffLabel = useMemo(() => {
    if (!summary) return "";
    if (!isCurrentYear) return "Ano fechado";
    const lastMonth = MONTH_LABELS[summary.asOfMonth - 1];
    return lastMonth ? `Acumulado até ${lastMonth}` : "Acumulado do ano";
  }, [summary, isCurrentYear]);

  function renderMonth(item: IAnnualByMonth) {
    const monthProgress =
      item.goal > 0 ? Math.min(item.collected / item.goal, 1) : 0;
    return (
      <View style={styles.card}>
        <View style={styles.monthCardHeader}>
          <Text style={styles.monthName}>{MONTH_LABELS[item.month - 1]}</Text>
          <Text style={styles.metaPercent}>{Math.round(item.percent)}%</Text>
        </View>
        <View style={styles.monthValueRow}>
          <Text style={styles.monthCollected}>
            {formatMoneyBRL(item.collected)}
          </Text>
          <Text style={styles.monthGoal}>/ {formatMoneyBRL(item.goal)}</Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${monthProgress * 100}%` }]}
          />
        </View>
        <View style={styles.monthSplitRow}>
          <View style={styles.monthSplitItem}>
            <QrCode size={13} color={colors.info} />
            <Text style={styles.monthSplitText}>
              {formatMoneyBRL(item.byMethod.pix)}
            </Text>
          </View>
          <View style={styles.monthSplitItem}>
            <Banknote size={13} color={colors.success} />
            <Text style={styles.monthSplitText}>
              {formatMoneyBRL(item.byMethod.cash)}
            </Text>
          </View>
          <View style={styles.monthSplitItem}>
            <CircleCheck size={13} color={colors.success} />
            <Text style={styles.monthSplitText}>
              {item.counts.paid}/{item.counts.total} pagaram
            </Text>
          </View>
        </View>
        {(() => {
          const mb = balanceByMonth.get(item.month);
          if (!mb) return null;
          const positivo = mb.resultado >= 0;
          return (
            <View style={styles.monthBalanceRow}>
              <View style={styles.monthBalanceItem}>
                <ArrowUpCircle size={13} color={colors.error} />
                <Text style={styles.monthBalanceLabel}>Saídas</Text>
                <Text style={styles.monthOut}>{formatMoneyBRL(mb.saidas)}</Text>
              </View>
              <View style={styles.monthBalanceItem}>
                <Text style={styles.monthBalanceLabel}>Resultado</Text>
                <Text
                  style={[
                    styles.monthNet,
                    { color: positivo ? colors.success : colors.error },
                  ]}
                >
                  {positivo ? "+" : "−"}
                  {formatMoneyBRL(Math.abs(mb.resultado))}
                </Text>
              </View>
            </View>
          );
        })()}
      </View>
    );
  }

  function renderMember(item: IAnnualByMember) {
    const metaParts = [`${item.monthsPaid} mês(es) pago(s)`];
    if (item.monthsPending > 0) {
      metaParts.push(`${item.monthsPending} pendente(s)`);
    }
    return (
      <View style={styles.memberCard}>
        <Avatar photo={item.photo} size={40} />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.memberMeta} numberOfLines={1}>
            {metaParts.join(" · ")}
          </Text>
        </View>
        <View style={styles.memberValues}>
          <Text style={styles.memberValue}>
            {formatMoneyBRL(item.totalPaid)}
          </Text>
          {item.totalDue > 0 && (
            <Text style={styles.memberDue}>
              deve {formatMoneyBRL(item.totalDue)}
            </Text>
          )}
        </View>
      </View>
    );
  }

  const header = summary ? (
    <View style={{ gap: styles.list.gap }}>
      <View style={styles.yearSelector}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setYear((y) => y - 1)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Ano anterior"
        >
          <ChevronLeft size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.yearLabel}>{year}</Text>
        <TouchableOpacity
          style={[styles.navButton, isCurrentYear && styles.navButtonDisabled]}
          onPress={() => !isCurrentYear && setYear((y) => y + 1)}
          disabled={isCurrentYear}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Próximo ano"
        >
          <ChevronRight size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.metaLabel}>{cutoffLabel}</Text>
          <Text style={styles.metaPercent}>{Math.round(progress * 100)}%</Text>
        </View>
        <View style={styles.metaValueRow}>
          <Text style={styles.metaCollected}>
            {formatMoneyBRL(summary.totals.collected)}
          </Text>
          <Text style={styles.metaGoal}>
            / {formatMoneyBRL(summary.totals.goal)}
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>
        <View style={styles.remainingRow}>
          {summary.totals.goal <= 0 ? (
            <>
              <Target size={16} color={colors.textMuted} />
              <Text style={styles.metaLabel}>
                Nenhuma contribuição registrada neste ano.
              </Text>
            </>
          ) : summary.totals.remaining > 0 ? (
            <>
              <Target size={16} color={colors.primary} />
              <Text style={styles.remainingText}>
                Falta{" "}
                <Text style={styles.remainingStrong}>
                  {formatMoneyBRL(summary.totals.remaining)}
                </Text>{" "}
                para a meta do ano
              </Text>
            </>
          ) : (
            <>
              <CircleCheck size={16} color={colors.success} />
              <Text style={styles.goalReachedText}>Meta do ano atingida!</Text>
            </>
          )}
        </View>
      </View>

      {balance && (
        <View style={styles.card}>
          <Text style={styles.balanceTitle}>Balanço do ano</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <View style={styles.balanceItemHeader}>
                <ArrowDownCircle size={14} color={colors.success} />
                <Text style={styles.balanceItemLabel}>Entradas</Text>
              </View>
              <Text style={styles.balanceValueIn}>
                {formatMoneyBRL(balance.totals.entradas)}
              </Text>
            </View>
            <View style={styles.balanceDivider} />
            <View style={styles.balanceItem}>
              <View style={styles.balanceItemHeader}>
                <ArrowUpCircle size={14} color={colors.error} />
                <Text style={styles.balanceItemLabel}>Saídas</Text>
              </View>
              <Text style={styles.balanceValueOut}>
                {formatMoneyBRL(balance.totals.saidas)}
              </Text>
            </View>
            <View style={styles.balanceDivider} />
            <View style={styles.balanceItem}>
              <View style={styles.balanceItemHeader}>
                <Wallet size={14} color={colors.primary} />
                <Text style={styles.balanceItemLabel}>Saldo</Text>
              </View>
              <Text
                style={[
                  styles.balanceValueNet,
                  {
                    color:
                      balance.totals.saldoFinal >= 0
                        ? colors.success
                        : colors.error,
                  },
                ]}
              >
                {formatMoneyBRL(balance.totals.saldoFinal)}
              </Text>
            </View>
          </View>
          <Text style={styles.balanceHint}>
            {isCurrentYear
              ? "Entradas − saídas, acumulado até o mês atual."
              : "Entradas − saídas do ano fechado."}
          </Text>

          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleExport}
            disabled={exporting}
            activeOpacity={0.8}
            accessibilityLabel="Exportar balanço em PDF"
          >
            {exporting ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <FileDown size={16} color={colors.primary} />
            )}
            <Text style={styles.exportButtonText}>
              {exporting ? "Gerando PDF…" : "Exportar PDF"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.metricGrid}>
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <QrCode size={16} color={colors.info} />
            <Text style={styles.metricLabel}>PIX</Text>
          </View>
          <Text style={styles.metricValue}>
            {formatMoneyBRL(summary.totals.byMethod.pix)}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Banknote size={16} color={colors.success} />
            <Text style={styles.metricLabel}>Dinheiro</Text>
          </View>
          <Text style={styles.metricValue}>
            {formatMoneyBRL(summary.totals.byMethod.cash)}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <CircleCheck size={16} color={colors.success} />
            <Text style={styles.metricLabel}>Pagamentos</Text>
          </View>
          <Text style={styles.metricValue}>{summary.totals.counts.paid}</Text>
        </View>
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <CircleAlert size={16} color={colors.error} />
            <Text style={styles.metricLabel}>Pendências</Text>
          </View>
          <Text style={styles.metricValue}>
            {summary.totals.counts.pending}
          </Text>
        </View>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, tab === "months" && styles.tabActive]}
          onPress={() => setTab("months")}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.tabText, tab === "months" && styles.tabTextActive]}
          >
            Por mês
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === "members" && styles.tabActive]}
          onPress={() => setTab("members")}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.tabText, tab === "members" && styles.tabTextActive]}
          >
            Membros ({summary.byMember.length})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : null;

  const listData: (IAnnualByMonth | IAnnualByMember)[] = summary
    ? tab === "months"
      ? // Meses do mais recente para o mais antigo (dez → jan).
        [...summary.byMonth].reverse()
      : summary.byMember
    : [];

  return (
    <View style={styles.container}>
      <Header
        name={member?.firstName + " " + member?.lastName}
        photo={member?.profileImage}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 32 }}
          />
        ) : !summary ? (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>
              Não foi possível carregar o balanço anual.
            </Text>
          </View>
        ) : (
          <FlatList
            data={listData}
            keyExtractor={(item) =>
              tab === "months"
                ? `m-${(item as IAnnualByMonth).month}`
                : (item as IAnnualByMember).id
            }
            renderItem={({ item }) =>
              tab === "months"
                ? renderMonth(item as IAnnualByMonth)
                : renderMember(item as IAnnualByMember)
            }
            ListHeaderComponent={header}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.centered}>
                <Text style={styles.emptyText}>
                  {tab === "months"
                    ? "Nenhum mês com arrecadação neste ano."
                    : "Nenhum membro com contribuição neste ano."}
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}
