import { Avatar } from "@/components/Avatar";
import { CoachTarget } from "@/components/CoachTarget";
import { MemberServices } from "@/services/MemberService";
import { IMember } from "@/types/Member";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Cake } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];


function getBirthdaysThisMonth(members: IMember[]): BirthdayMember[] {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  return members
    .filter((m) => m.dateOfBirth && new Date(m.dateOfBirth).getMonth() === currentMonth)
    .map((m) => {
      const date = new Date(m.dateOfBirth);
      const day = date.getDate();
      return {
        _id: m._id,
        firstName: m.firstName,
        lastName: m.lastName,
        profileImage: m.profileImage,
        day,
        month: date.getMonth(),
        isToday: day === currentDay,
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
    MemberServices.listMembers()
      .then((data: IMember[]) => setMembers(getBirthdaysThisMonth(data)))
      .catch(() => {});
  }, []);

  if (members.length === 0) return null;

  const todayCount = members.filter((m) => m.isToday).length;
  const fabBottom = tabBarHeight + 32;

  return (
    <>
      <CoachTarget id="birthday-fab" style={[styles.fab, { bottom: fabBottom }]}>
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
        <View style={styles.modalOverlay}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <Cake size={16} style={styles.sheetIcon} />
              <Text style={styles.sheetTitle}>Aniversariantes do mês</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} hitSlop={12}>
                <Text style={styles.sheetClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {members.map((item) => (
                <View
                  key={item._id}
                  style={[styles.listItem, item.isToday && styles.listItemToday]}
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
                    <Text style={[styles.listItemName, item.isToday && styles.listItemNameToday]}>
                      {item.firstName} {item.lastName}
                    </Text>
                    <Text style={[styles.listItemDate, item.isToday && styles.listItemDateToday]}>
                      {item.isToday ? "🎉 Hoje!" : `${item.day} de ${MONTHS_PT[item.month]}`}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
