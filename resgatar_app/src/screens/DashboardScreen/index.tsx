import React, { useContext, useRef, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { NotificationCard } from "@/components/NotificationCard";
import { Header } from "@/components/Header";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { NotificationSkeleton } from "@/components/Skeleton/NotificationSkeleton";
import { NotificationServices } from "@/services/NotificationService";
import { ToastMessage } from "@/components/Toast";
import { INotification } from "@/types/Notification";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { AuthContext } from "@/context/AuthContext";
import { EmptyNotices } from "@/components/EmptyNotice";

export function DashboardScreen() {
  const { member } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<INotification[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const listRef = useRef<FlatList>(null);
  const newNotifications = data.filter(
    (notification) => notification.isNew,
  ).length;

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

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await NotificationServices.listNotifications();
      setData(response);
    } catch (error: any) {
      ToastMessage.error(
        "Não foi possível carregar as notificações",
        error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header name={member?.firstName + " " + member?.lastName} />

      <View style={styles.content}>
        {loading ? (
          <>
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </>
        ) : data.length === 0 ? (
          <EmptyNotices />
        ) : (
          <>
            <View style={styles.avisosHeader}>
              <Text style={styles.avisosTitle}>Avisos</Text>
              {newNotifications > 0 && (
                <Text style={styles.badge}>novas notificações</Text>
              )}
            </View>
            <FlatList
              data={data}
              keyExtractor={(item) => item._id}
              renderItem={({ item, index }) => (
                <NotificationCard
                  notification={item}
                  expanded={expandedId === item._id}
                  onToggle={() => handleToggle(item._id, index)}
                />
              )}
              getItemLayout={(_, index) => ({
                length: 120,
                offset: 120 * index,
                index,
              })}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
