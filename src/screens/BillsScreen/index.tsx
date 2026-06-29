import { CoachTarget } from "@/components/CoachTarget";
import { ContributionItem } from "@/components/ContributionItem";
import { Header } from "@/components/Header";
import { ToastMessage } from "@/components/Toast";
import { AuthContext } from "@/context/AuthContext";
import { ChargeContext } from "@/context/ChargeContext";
import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SHADOW, SPACING, TYPOGRAPHY } from "@/theme";
import { TRANSACTION_STATUS } from "@/types/Charge";
import { formatDateFromTimestamp, formatMoneyBRL } from "@/utils/helper";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { HandHeart } from "lucide-react-native";
import React, { useContext, useMemo, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { ModalComprovante } from "./ModalComprovante";
import { ModalDonate } from "../ProfileScreen/ModalDonate";
import { PixPaymentModal } from "./PixPaymentModal";
import { useStyles } from "./styles";

const MONTH: Record<string, string> = {
  january: "Janeiro",
  february: "Fevereiro",
  march: "Março",
  april: "Abril",
  may: "Maio",
  june: "Junho",
  july: "Julho",
  august: "Agosto",
  september: "Setembro",
  october: "Outubro",
  november: "Novembro",
  december: "Dezembro",
};

export const BillsScreen = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const { charge, createCharge } = useContext(ChargeContext);
  const { member } = useContext(AuthContext);
  const { colors } = useAppTheme();
  const styles = useStyles();
  const [donateModalVisible, setDonateModalVisible] = useState(false);

  const [modalPayVisible, setModalPayVisible] = useState(false);
  const [comprovanteItem, setComprovanteItem] = useState<null | {
    name: string;
    email: string;
    cpf: string;
    docType?: string;
    month: string;
    paidAt: string;
    value: string;
    method?: string;
  }>(null);

  const handlePay = async (item: any) => {
    await createCharge(Object.values(MONTH).indexOf(item.month))
      .then(() => {
        setModalPayVisible(true);
      })
      .catch(() => {
        ToastMessage.error("Erro ao criar cobrança. Tente novamente.");
      });
  };

  const contributions = useMemo(
    () =>
      Object.entries(member?.contributions.months || {}).map(
        ([month, { paid, value, paidAt, paymentMethod }], index) => {
          const methodLabel = paymentMethod === "cash" ? "Dinheiro" : "PIX";
          return {
            id: `${index}`,
            month: MONTH[month],
            paidAt: `${formatDateFromTimestamp(new Date(paidAt).getTime())}`,
            value: paid
              ? formatMoneyBRL(value)
              : formatMoneyBRL(member?.paymentInfo.amount ?? 0),
            method: methodLabel,
            description: paid
              ? `Pago em ${formatDateFromTimestamp(
                  new Date(paidAt).getTime(),
                )} · ${methodLabel}`
              : "Pagamento a ser realizado",
            status: paid
              ? TRANSACTION_STATUS.APPROVED
              : TRANSACTION_STATUS.PENDING,
          };
        },
      ),
    [member],
  );

  return (
    <View style={styles.container}>
      <Header
        name={member?.firstName + " " + member?.lastName}
        photo={member?.profileImage}
      />

      <FlatList
        contentContainerStyle={[
          styles.list,
          { paddingBottom: tabBarHeight + 70 },
        ]}
        data={contributions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <CoachTarget id="bills-donation">
            <TouchableOpacity
              onPress={() => setDonateModalVisible(true)}
              style={{
                backgroundColor: colors.primary,
                borderRadius: RADIUS.md,
                padding: SPACING.lg,
                flexDirection: "row",
                alignItems: "center",
                gap: SPACING.md,
                marginBottom: SPACING.lg,
                ...SHADOW.card,
              }}
            >
              <HandHeart color={colors.white} size={28} />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.white,
                    fontSize: TYPOGRAPHY.subtitle,
                    fontWeight: "700",
                  }}
                >
                  Fazer uma doação
                </Text>
                <Text
                  style={{
                    color: colors.white,
                    fontSize: TYPOGRAPHY.small,
                    opacity: 0.85,
                    marginTop: 2,
                  }}
                >
                  Contribua com um valor extra via PIX ou dinheiro
                </Text>
              </View>
            </TouchableOpacity>
          </CoachTarget>
        }
        renderItem={({ item }) => (
          <ContributionItem
            data={item}
            onPay={() => handlePay(item)}
            onShare={() =>
              setComprovanteItem({
                ...item,
                cpf: member?.identification.numberType as string,
                docType: member?.identification.type,
                name: member?.firstName as string,
                email: member?.email as string,
              })
            }
          />
        )}
      />

      {modalPayVisible && (
        <PixPaymentModal
          visible={modalPayVisible}
          onClose={() => setModalPayVisible(false)}
          payment={{
            amountLabel: `${charge.transactionAmount ?? ""}`.replace(".", ","),
            qrCode: charge.transactionData?.qrCode ?? "",
            status: charge.status,
          }}
        />
      )}

      {comprovanteItem && (
        <ModalComprovante
          visible={!!comprovanteItem}
          onClose={() => setComprovanteItem(null)}
          data={comprovanteItem}
        />
      )}

      {donateModalVisible && (
        <ModalDonate
          visible={donateModalVisible}
          onClose={() => setDonateModalVisible(false)}
          isAdmin={member?.role === "admin"}
        />
      )}
    </View>
  );
};
