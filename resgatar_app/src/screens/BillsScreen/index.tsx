import React, { useContext, useState } from "react";
import { styles } from "./styles";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ContributionItem } from "@/components/ContributionItem";
import { PixPaymentModal } from "./PixPaymentModal";
import { ChargeContext } from "@/context/ChargeContext";
import { TRANSACTION_STATUS } from "@/types/Charge";
import { AuthContext } from "@/context/AuthContext";
import { formatUTCToDateBR } from "@/utils/helper";
import { DashboardHeader } from "@/components/DashboardHeader";

const MONTH: Record<string, string> = {
  january: "Janeiro",
  february: "Fevereiro",
  march: "Março",
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
  const { createCharge } = useContext(ChargeContext);
  const { member } = useContext(AuthContext);
  const [modalPayVisible, setModalPayVisible] = useState(false);

  const handlePay = async (item: any) => {
    await createCharge(item.value.replace("R$", "").trim()).then(() => {
      setModalPayVisible(true);
    });
  };

  const handleShare = async (item: any) => {};

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader name={member?.firstName as string} />

      <FlatList
        contentContainerStyle={styles.list}
        data={Object.entries(member?.contributions.months || {}).map(
          ([month, { paid, value, paidAt }], index) => ({
            id: `${index}`,
            month: MONTH[month],
            value: paid
              ? `R$ ${value}`.replace(".", ",")
              : `R$ ${member?.paymentInfo.amount}`.replace(".", ","),
            description: paid
              ? `Pago em ${formatUTCToDateBR(new Date(paidAt).getTime())}`
              : "Pagamento a ser realizado",
            status: paid
              ? TRANSACTION_STATUS.APPROVED
              : TRANSACTION_STATUS.PENDING,
          })
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ContributionItem
            data={item}
            onPay={() => handlePay(item)}
            onShare={() => handleShare(item)}
          />
        )}
      />

      {modalPayVisible && (
        <PixPaymentModal
          visible={modalPayVisible}
          onClose={() => setModalPayVisible(false)}
        />
      )}
    </SafeAreaView>
  );
};
