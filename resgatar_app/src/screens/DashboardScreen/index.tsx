import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { NotificationCard } from "@/components/NotificationCard";
import { DashboardHeader } from "@/components/DashboardHeader";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { NotificationSkeleton } from "@/components/Skeleton/NotificationSkeleton";

export function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const listRef = useRef<FlatList>(null);

  const handleToggle = (id: string, index: number) => {
    setExpandedId((current) => (current === id ? null : id));

    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.2,
      });
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setData([
        {
          id: "1",
          title: "Assembleia Geral Extraordinária",
          description:
            "Convocamos todos os associados para a assembleia Convocamos todos os associados para a assembleia Convocamos todos os associados para a assembleia Convocamos todos os associados para a assembleia",
          date: "Hoje às 10:30",
          type: "info",
          isNew: true,
        },
        {
          id: "2",
          title: "Lembrete: Contribuição de Dezembro",
          description: "Não esqueça de realizar sua contribuição mensal",
          date: "Ontem às 14:00",
          type: "success",
          isNew: true,
        },
        {
          id: "3",
          title: "Manutenção Programada",
          description: "O sistema ficará indisponível no domingo",
          date: "20 Dez 2024",
          type: "warning",
          isNew: false,
        },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader name="Vitor" />

      <View style={styles.content}>
        <View style={styles.avisosHeader}>
          <Text style={styles.avisosTitle}>Avisos</Text>
          <Text style={styles.badge}>2 novos</Text>
        </View>

        {loading ? (
          <>
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <NotificationCard
                notification={item}
                expanded={expandedId === item.id}
                onToggle={() => handleToggle(item.id, index)}
              />
            )}
            getItemLayout={(_, index) => ({
              length: 120,
              offset: 120 * index,
              index,
            })}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
