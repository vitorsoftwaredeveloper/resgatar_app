import React from "react";
import { styles } from "./styles";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ContributionItem } from "@/components/ContributionItem";

const DATA: any[] = [
  {
    id: "1",
    month: "Dezembro 2024",
    value: "R$ 50,00",
    description: "Vence em 10/12/2024",
    status: "PENDING",
  },
  {
    id: "2",
    month: "Novembro 2024",
    value: "R$ 50,00",
    description: "Pago em 08/11/2024",
    status: "PAID",
  },
  {
    id: "3",
    month: "Outubro 2024",
    value: "R$ 50,00",
    description: "Pago em 10/10/2024",
    status: "PAID",
  },
  {
    id: "4",
    month: "Setembro 2024",
    value: "R$ 50,00",
    description: "Pago em 09/09/2024",
    status: "PAID",
  },
];

export const BillsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contribuições</Text>
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ContributionItem
            data={item}
            onPay={() => console.log("Pagar", item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
};
