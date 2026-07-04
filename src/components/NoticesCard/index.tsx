import { CoachTarget } from "@/components/CoachTarget";
import { useAppTheme } from "@/context/ThemeContext";
import { AuthContext } from "@/context/AuthContext";
import { CommitmentService } from "@/services/CommitmentService";
import { ICommitment } from "@/types/Commitment";
import { commitmentScheduleLabel, isCommitmentToday } from "@/utils/commitment";
import { useFocusEffect } from "@react-navigation/native";
import { NoticesCardSkeleton } from "@/components/Skeleton/NoticesCardSkeleton";
import { ChevronRight } from "lucide-react-native";
import React, { useCallback, useContext, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { NoticeBoardModal } from "@/screens/NoticeBoardScreen";
import { useStyles } from "./styles";

export function NoticesCard() {
  const styles = useStyles();
  const { colors } = useAppTheme();
  const { member, sessionVersion } = useContext(AuthContext);
  const isAdmin = member?.role === "admin";

  const [items, setItems] = useState<ICommitment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const skipNextFetch = useRef(false);
  const fetchedSessionVersion = useRef<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (skipNextFetch.current) {
        skipNextFetch.current = false;
        return;
      }
      if (fetchedSessionVersion.current === sessionVersion) return;
      fetchedSessionVersion.current = sessionVersion;
      CommitmentService.list()
        .then(setItems)
        .catch(() => setItems([]))
        .finally(() => setLoaded(true));
    }, [sessionVersion]),
  );

  return (
    <CoachTarget id="notices-card">
      <View style={styles.container}>
        <Pressable
          style={styles.header}
          onPress={isAdmin ? () => setModalVisible(true) : undefined}
          disabled={!isAdmin}
          accessibilityLabel={isAdmin ? "Gerenciar Quadro de Avisos" : undefined}
        >
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              Compromissos da comunidade
            </Text>
          </View>
          {isAdmin && <ChevronRight size={20} color={colors.textMuted} />}
        </Pressable>

        {!loaded ? (
          <NoticesCardSkeleton />
        ) : items.length === 0 ? (
          <Text style={styles.emptyText}>
            Nenhum compromisso publicado ainda.
          </Text>
        ) : (
          items.map((item, i) => {
            const today = isCommitmentToday(item);
            return (
              <View
                key={item.id}
                style={[
                  styles.row,
                  today
                    ? styles.rowToday
                    : i < items.length - 1 && styles.rowBorder,
                ]}
              >
                <View style={styles.texts}>
                  <View style={styles.titleRow}>
                    <Text
                      style={[styles.title, today && styles.titleToday]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    {today && (
                      <View style={styles.todayTag}>
                        <Text style={styles.todayTagText}>HOJE</Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={[styles.date, today && styles.dateToday]}
                    numberOfLines={1}
                  >
                    {commitmentScheduleLabel(item)} ·{" "}
                    <Text style={styles.timeTag}>{item.time}</Text> ·{" "}
                    {item.location}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      <NoticeBoardModal
        visible={modalVisible}
        onClose={(finalItems) => {
          setModalVisible(false);
          if (finalItems.length > 0) {
            setItems(finalItems);
            skipNextFetch.current = true;
          } else {
            CommitmentService.list().then(setItems).catch(() => {});
          }
        }}
      />
    </CoachTarget>
  );
}
