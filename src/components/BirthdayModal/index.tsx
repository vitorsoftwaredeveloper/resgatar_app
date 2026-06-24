import { Avatar } from "@/components/Avatar";
import { MemberServices } from "@/services/MemberService";
import { IMember } from "@/types/Member";
import { Cake } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
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

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function BirthdayModal({ visible, onClose }: Props) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const [members, setMembers] = useState<BirthdayMember[]>([]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    MemberServices.listBirthdayMembers()
      .then((data: IMember[]) => setMembers(getBirthdaysThisMonth(data)))
      .catch(() => {});
  }, []);

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent
      presentationStyle="overFullScreen"
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <Cake size={16} color={styles.headerIcon.color} />
              <Text style={styles.title}>Aniversariantes do mês</Text>
              <TouchableOpacity onPress={onClose} hitSlop={12}>
                <Text style={styles.close}>✕</Text>
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
  );
}
