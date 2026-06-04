import React, { useContext, useState, useMemo } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";
import { ContributionItem } from "@/components/ContributionItem";
import { PixPaymentModal } from "./PixPaymentModal";
import { Header } from "@/components/Header";
import { ChargeContext } from "@/context/ChargeContext";
import { AuthContext } from "@/context/AuthContext";
import { TRANSACTION_STATUS } from "@/types/Charge";
import { formatDateFromTimestamp } from "@/utils/helper";
import { shareComprovantePDF } from "@/utils/generatePixReceipt";
import { ToastMessage } from "@/components/Toast";

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
  const { createCharge } = useContext(ChargeContext);
  const { member } = useContext(AuthContext);

  const [modalPayVisible, setModalPayVisible] = useState(false);

  const handlePay = async (item: any) => {
    await createCharge(
      item.value.replace("R$", "").trim(),
      Object.values(MONTH).indexOf(item.month),
    )
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
          value: paid
            ? `R$ ${value}`.replace(".", ",")
            : `R$ ${member?.paymentInfo.amount}`.replace(".", ","),
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
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Header name={member?.firstName + " " + member?.lastName} />

      <FlatList
        contentContainerStyle={styles.list}
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
    </SafeAreaView>
  );
};
