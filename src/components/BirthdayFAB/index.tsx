import { Avatar } from "@/components/Avatar";
import { CoachTarget } from "@/components/CoachTarget";
import { MemberServices } from "@/services/MemberService";
import { IMember } from "@/types/Member";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Cake } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "./styles";

interface BirthdayMember {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  day: number;
  month: number;
  isToday: boolean;
}

const MONTHS_PT = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

function parseBirthDate(
  dateOfBirth: string | number,
): { day: number; month: number } | null {
  if (!dateOfBirth) return null;
  const numeric = Number(dateOfBirth);
  const ts = !isNaN(numeric) ? numeric : Date.parse(dateOfBirth as string);
  if (isNaN(ts)) return null;
  // Use UTC values to avoid timezone shifting the month/day
  const d = new Date(ts);
  return { day: d.getUTCDate(), month: d.getUTCMonth() };
}

function getBirthdaysThisMonth(members: IMember[]): BirthdayMember[] {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  return members
    .filter((m) => {
      const parsed = parseBirthDate(m.dateOfBirth);
      return parsed !== null && parsed.month === currentMonth;
    })
    .map((m) => {
      const { day, month } = parseBirthDate(m.dateOfBirth)!;
      return {
        _id: m._id,
        firstName: m.firstName,
        lastName: m.lastName,
        profileImage: m.profileImage,
        day,
        month,
        isToday: day === currentDay && month === currentMonth,
      };
    })
    .sort((a, b) => {
      if (a.isToday !== b.isToday) return a.isToday ? -1 : 1;
      return a.day - b.day;
    });
}

export function BirthdayFAB() {
  const styles = useStyles();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const [members, setMembers] = useState<BirthdayMember[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    MemberServices.listBirthdayMembers()
      .then((data: IMember[]) => setMembers(getBirthdaysThisMonth(data)))
      .catch(() => {});
  }, []);

  const todayCount = members.filter((m) => m.isToday).length;
  const fabBottom = tabBarHeight + 32;

  return (
    <>
      <CoachTarget
        id="birthday-fab"
        style={[styles.fab, { bottom: fabBottom }]}
      >
        <TouchableOpacity
          style={styles.fabInner}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
        >
          <Cake size={22} color="#fff" />
          {todayCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{todayCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </CoachTarget>

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
        transparent
        presentationStyle="overFullScreen"
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <View style={styles.sheetHandle} />

              <View style={styles.sheetHeader}>
                <Cake size={16} color={styles.sheetIcon.color} />
                <Text style={styles.sheetTitle}>Aniversariantes do mês</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  hitSlop={12}
                >
                  <Text style={styles.sheetClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {members.length === 0 && (
                  <Text style={styles.emptyText}>
                    Nenhum aniversariante neste mês
                  </Text>
                )}
                {members.map((item) => (
                  <View
                    key={item._id}
                    style={[
                      styles.listItem,
                      item.isToday && styles.listItemToday,
                    ]}
                  >
                    <View style={item.isToday ? styles.avatarRing : undefined}>
                      <Avatar photo={item.profileImage} size={48} />
                      {item.isToday && (
                        <View style={styles.todayBadge}>
                          <Text style={styles.todayBadgeText}>🎂</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.listItemInfo}>
                      <Text
                        style={[
                          styles.listItemName,
                          item.isToday && styles.listItemNameToday,
                        ]}
                      >
                        {item.firstName} {item.lastName}
                      </Text>
                      <Text
                        style={[
                          styles.listItemDate,
                          item.isToday && styles.listItemDateToday,
                        ]}
                      >
                        {item.isToday
                          ? "🎉 Hoje!"
                          : `${item.day} de ${MONTHS_PT[item.month]}`}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
