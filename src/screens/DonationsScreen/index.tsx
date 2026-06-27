import { Header } from "@/components/Header";
import { ToastMessage } from "@/components/Toast";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { DonationServices } from "@/services/DonationService";
import { TRANSACTION_STATUS, isReturnedTransaction } from "@/types/Charge";
import { IDonation } from "@/types/Donation";
import { formatMoneyBRL } from "@/utils/helper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  Banknote,
  ChevronLeft,
  ChevronRight,
  Gift,
  QrCode,
} from "lucide-react-native";
import React, { useCallback, useContext, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

// Soma valores no formato "xx,xx" (vírgula decimal) em centavos para evitar
// erro de ponto flutuante, e devolve um número em reais.
function sumAmounts(donations: IDonation[]): number {
  const cents = donations.reduce((acc, d) => {
    const normalized = d.amount.replace(/\./g, "").replace(",", ".");
    const value = parseFloat(normalized);
    return acc + (isNaN(value) ? 0 : Math.round(value * 100));
  }, 0);
  return cents / 100;
}

export function DonationsScreen() {
  const navigation = useNavigation();
  const styles = useStyles();
  const { colors } = useAppTheme();
  const { member } = useContext(AuthContext);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [donations, setDonations] = useState<IDonation[]>([]);
  const [loading, setLoading] = useState(true);

  // Bloqueia navegação para meses futuros (igual à Arrecadação/Despesa).
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  // A listagem é por mês, mas o endpoint só filtra por ano; buscamos o ano
  // inteiro e filtramos o mês no cliente, evitando refetch ao trocar de mês.
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await DonationServices.list(year);
      // Doações estornadas/devolvidas saem da lista: o dinheiro voltou ao doador.
      setDonations(data.filter((d) => !isReturnedTransaction(d.status)));
    } catch {
      setDonations([]);
      ToastMessage.error("Erro", "Não foi possível carregar as doações.");
    } finally {
      setLoading(false);
    }
  }, [year]);

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

  // Doações do mês selecionado, mais recentes primeiro (cash sem hora vem por último).
  const monthDonations = useMemo(
    () => donations.filter((d) => d.referenceMonth === month),
    [donations, month],
  );

  // Apenas doações aprovadas entram no total e na quebra por método; PIX
  // pendente/recusado não representa dinheiro em caixa.
  const approved = useMemo(
    () =>
      monthDonations.filter((d) => d.status === TRANSACTION_STATUS.APPROVED),
    [monthDonations],
  );

  const total = useMemo(() => sumAmounts(approved), [approved]);
  const pixTotal = useMemo(
    () => sumAmounts(approved.filter((d) => d.paymentMethodId === "pix")),
    [approved],
  );
  const cashTotal = useMemo(
    () => sumAmounts(approved.filter((d) => d.paymentMethodId === "cash")),
    [approved],
  );

  function renderDonation({ item }: { item: IDonation }) {
    const isPix = item.paymentMethodId === "pix";
    const isApproved = item.status === TRANSACTION_STATUS.APPROVED;
    return (
      <View style={styles.donationCard}>
        <View style={styles.donationRow}>
          <View style={styles.methodIcon}>
            {isPix ? (
              <QrCode size={18} color={colors.info} />
            ) : (
              <Banknote size={18} color={colors.success} />
            )}
          </View>
          <View style={styles.donationInfo}>
            <Text style={styles.donationName} numberOfLines={1}>
              {item.donorName?.trim() || "Anônimo"}
            </Text>
            <Text style={styles.donationMeta} numberOfLines={1}>
              {isPix ? "PIX" : "Dinheiro"}
            </Text>
          </View>
          <View style={styles.donationValues}>
            <Text style={styles.donationValue}>
              {formatMoneyBRL(item.amount)}
            </Text>
            {!isApproved && (
              <Text style={styles.donationStatus}>
                {item.status === TRANSACTION_STATUS.PENDING
                  ? "Pendente"
                  : "Não confirmada"}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  }

  const header = (
    <View style={{ gap: styles.list.gap }}>
      <View style={styles.yearSelector}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={goToPreviousMonth}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Mês anterior"
        >
          <ChevronLeft size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.yearLabel}>
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
        <Text style={styles.metaLabel}>Total de doações no mês</Text>
        <Text style={styles.totalValue}>{formatMoneyBRL(total)}</Text>
        <Text style={styles.metaLabel}>
          {approved.length}{" "}
          {approved.length === 1 ? "doação confirmada" : "doações confirmadas"}
        </Text>

        <View style={styles.breakdown}>
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLabelRow}>
              <QrCode size={14} color={colors.info} />
              <Text style={styles.breakdownLabel}>PIX</Text>
            </View>
            <Text style={styles.breakdownValue}>{formatMoneyBRL(pixTotal)}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLabelRow}>
              <Banknote size={14} color={colors.success} />
              <Text style={styles.breakdownLabel}>Dinheiro</Text>
            </View>
            <Text style={styles.breakdownValue}>
              {formatMoneyBRL(cashTotal)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        name={member?.firstName + " " + member?.lastName}
        photo={member?.profileImage}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <Text style={styles.screenTitle}>Listagem de doações</Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 32 }}
          />
        ) : (
          <FlatList
            data={monthDonations}
            keyExtractor={(item) => item.transactionId}
            renderItem={renderDonation}
            ListHeaderComponent={header}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.centered}>
                <Gift size={32} color={colors.textMuted} />
                <Text style={styles.emptyText}>
                  Nenhuma doação registrada neste mês.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}
