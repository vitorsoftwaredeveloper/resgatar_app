import React, { use, useContext, useEffect, useState } from "react";
import { styles } from "./styles";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ContributionItem } from "@/components/ContributionItem";
import { PixPaymentModal } from "./PixPaymentModal";
import { ChargeContext } from "@/context/ChargeContext";
import { TRANSACTION_STATUS } from "@/types/Charge";
import { LoadingContext } from "@/context/LoadingContext";
import { AuthContext } from "@/context/AuthContext";
import { formatUTCToDateBR } from "@/utils/helper";

const DATA: any[] = [
  {
    id: "1",
    month: "Dezembro 2024",
    value: "R$ 50,00",
    description: "Vence em 10/12/2024",
    status: TRANSACTION_STATUS.PENDING,
  },
  {
    id: "2",
    month: "Novembro 2024",
    value: "R$ 50,00",
    description: "Pago em 08/11/2024",
    status: TRANSACTION_STATUS.APPROVED,
  },
  {
    id: "3",
    month: "Outubro 2024",
    value: "R$ 50,00",
    description: "Pago em 10/10/2024",
    status: TRANSACTION_STATUS.APPROVED,
  },
  {
    id: "4",
    month: "Setembro 2024",
    value: "R$ 50,00",
    description: "Pago em 09/09/2024",
    status: TRANSACTION_STATUS.APPROVED,
  },
];

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

  console.log("Bills", member?.contributions.months);

  const handlePay = async (item: any) => {
    await createCharge(
      Number(item.value.replace("R$", "").replace(",", "."))
    ).then(() => {
      setModalPayVisible(true);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contribuições</Text>
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={Object.entries(member?.contributions.months || {})
          .map(([month, { paid, value, paidAt }], index) => ({
            id: `${index}`,
            month: MONTH[month],
            value: paid
              ? `R$ ${value}`.replace(".", ",")
              : `R$ ${member?.paymentInfo.amount}`.replace(".", ","),
            description: paid
              ? `Pago em ${formatUTCToDateBR(new Date(paidAt).getTime())}`
              : "Vence em 10/12/2024",
            status: paid
              ? TRANSACTION_STATUS.APPROVED
              : TRANSACTION_STATUS.PENDING,
          }))
          .reverse()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ContributionItem data={item} onPay={() => handlePay(item)} />
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
