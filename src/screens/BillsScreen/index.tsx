import { ContributionItem } from "@/components/ContributionItem";
import { Header } from "@/components/Header";
import { SwipeableTab } from "@/components/SwipeableTab";
import { ToastMessage } from "@/components/Toast";
import { AuthContext } from "@/context/AuthContext";
import { ChargeContext } from "@/context/ChargeContext";
import { TRANSACTION_STATUS } from "@/types/Charge";
import { shareComprovantePDF } from "@/utils/generatePixReceipt";
import { formatDateFromTimestamp, formatMoneyBRL } from "@/utils/helper";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useContext, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
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
  const { createCharge } = useContext(ChargeContext);
  const { member } = useContext(AuthContext);
  const styles = useStyles();

  const [modalPayVisible, setModalPayVisible] = useState(false);

  const handlePay = async (item: any) => {
    await createCharge(item.rawValue, Object.values(MONTH).indexOf(item.month))
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
        ([month, { paid, value, paidAt }], index) => ({
          id: `${index}`,
          month: MONTH[month],
          paidAt: `${formatDateFromTimestamp(new Date(paidAt).getTime())}`,
          rawValue: paid ? String(value) : String(member?.paymentInfo.amount),
          value: paid
            ? formatMoneyBRL(value)
            : formatMoneyBRL(member?.paymentInfo.amount ?? 0),
          description: paid
            ? `Pago em ${formatDateFromTimestamp(new Date(paidAt).getTime())}`
            : "Pagamento a ser realizado",
          status: paid
            ? TRANSACTION_STATUS.APPROVED
            : TRANSACTION_STATUS.PENDING,
        }),
      ),
    [member],
  );

  return (
    <SwipeableTab>
      <View style={styles.container}>
        <Header name={member?.firstName + " " + member?.lastName} />

        <FlatList
          contentContainerStyle={[
            styles.list,
            { paddingBottom: tabBarHeight + 70 },
          ]}
          data={contributions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ContributionItem
              data={item}
              onPay={() => handlePay(item)}
              onShare={() =>
                shareComprovantePDF({
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
          />
        )}
      </View>
    </SwipeableTab>
  );
};
