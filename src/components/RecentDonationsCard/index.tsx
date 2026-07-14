import { CoachTarget } from "@/components/CoachTarget";
import { NoticesCardSkeleton } from "@/components/Skeleton/NoticesCardSkeleton";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { DonationServices } from "@/services/DonationService";
import { TRANSACTION_STATUS, isReturnedTransaction } from "@/types/Charge";
import { IDonation } from "@/types/Donation";
import { formatMoneyBRL } from "@/utils/helper";
import { useFocusEffect } from "@react-navigation/native";
import { Banknote, HandCoins, QrCode } from "lucide-react-native";
import React, { useCallback, useContext, useRef, useState } from "react";
import { Text, View } from "react-native";
import { useStyles } from "./styles";

// Prévia das doações avulsas do mês corrente — visível para qualquer membro,
// só leitura (sem link para nenhuma tela). Portado de resgatar-browser
// (RecentDonationsCard); busca os próprios dados, como os demais cards do app.

const DISPLAY_LIMIT = 5;

export function RecentDonationsCard() {
  const styles = useStyles();
  const { colors } = useAppTheme();
  const { sessionVersion } = useContext(AuthContext);

  const [donations, setDonations] = useState<IDonation[]>([]);
  const [loaded, setLoaded] = useState(false);
  const fetchedSessionVersion = useRef<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (fetchedSessionVersion.current === sessionVersion) return;
      fetchedSessionVersion.current = sessionVersion;

      const now = new Date();
      DonationServices.list(now.getFullYear())
        .then((data) =>
          setDonations(
            data.filter(
              (d) =>
                d.referenceMonth === now.getMonth() &&
                !isReturnedTransaction(d.status),
            ),
          ),
        )
        .catch(() => setDonations([]))
        .finally(() => setLoaded(true));
    }, [sessionVersion]),
  );

  const items = donations.slice(0, DISPLAY_LIMIT);

  return (
    <CoachTarget id="recent-donations-card">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Doações do mês</Text>
        </View>

        {!loaded ? (
          <NoticesCardSkeleton rows={3} />
        ) : items.length === 0 ? (
          <View style={styles.emptyState}>
            <HandCoins size={22} color={colors.textMuted} />
            <Text style={styles.emptyText}>
              Nenhuma doação registrada neste mês
            </Text>
          </View>
        ) : (
          items.map((item, i) => {
            const isPix = item.paymentMethodId === "pix";
            const isApproved = item.status === TRANSACTION_STATUS.APPROVED;
            return (
              <View
                key={item.transactionId}
                style={[styles.row, i < items.length - 1 && styles.rowBorder]}
              >
                <View style={styles.methodIcon}>
                  {isPix ? (
                    <QrCode size={16} color={colors.info} />
                  ) : (
                    <Banknote size={16} color={colors.success} />
                  )}
                </View>
                <View style={styles.texts}>
                  <Text style={styles.name} numberOfLines={1}>
                    {item.donorName?.trim() || "Anônimo"}
                  </Text>
                  <Text style={styles.meta}>{isPix ? "PIX" : "Dinheiro"}</Text>
                </View>
                <View style={styles.values}>
                  <Text style={styles.value}>{formatMoneyBRL(item.amount)}</Text>
                  {!isApproved && (
                    <Text style={styles.status}>
                      {item.status === TRANSACTION_STATUS.PENDING
                        ? "Pendente"
                        : "Não confirmada"}
                    </Text>
                  )}
                </View>
              </View>
            );
          })
        )}
      </View>
    </CoachTarget>
  );
}
