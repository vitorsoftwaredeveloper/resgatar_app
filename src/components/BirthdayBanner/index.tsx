import { Avatar } from "@/components/Avatar";
import { MemberServices } from "@/services/MemberService";
import { IMember } from "@/types/Member";
import { Cake } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useStyles } from "./styles";

interface BirthdayMember {
  _id: string;
  firstName: string;
  profileImage?: string;
  day: number;
  isToday: boolean;
}

const DEV_MOCK_MEMBERS: IMember[] = __DEV__
  ? [
      { _id: "m1", firstName: "Ana",     lastName: "Silva",   dateOfBirth: new Date(1990,  5,  3).getTime(), email: "", phoneNumber: "", paymentInfo: { datePayment: 1, amount: "0" }, identification: { type: "CPF", numberType: "" } },
      { _id: "m2", firstName: "Carlos",  lastName: "Souza",   dateOfBirth: new Date(1985,  5, 10).getTime(), email: "", phoneNumber: "", paymentInfo: { datePayment: 1, amount: "0" }, identification: { type: "CPF", numberType: "" } },
      { _id: "m3", firstName: "Fernanda",lastName: "Lima",    dateOfBirth: new Date(1993,  5, 15).getTime(), email: "", phoneNumber: "", paymentInfo: { datePayment: 1, amount: "0" }, identification: { type: "CPF", numberType: "" } },
      { _id: "m4", firstName: "Vitor",   lastName: "Silva",   dateOfBirth: new Date(1997,  5, 23).getTime(), email: "", phoneNumber: "", paymentInfo: { datePayment: 1, amount: "0" }, identification: { type: "CPF", numberType: "" } },
      { _id: "m5", firstName: "Roberto", lastName: "Costa",   dateOfBirth: new Date(1978,  5, 20).getTime(), email: "", phoneNumber: "", paymentInfo: { datePayment: 1, amount: "0" }, identification: { type: "CPF", numberType: "" } },
      { _id: "m6", firstName: "Juliana", lastName: "Ferreira",dateOfBirth: new Date(2000,  5, 28).getTime(), email: "", phoneNumber: "", paymentInfo: { datePayment: 1, amount: "0" }, identification: { type: "CPF", numberType: "" } },
    ]
  : [];

function getBirthdaysThisMonth(members: IMember[]): BirthdayMember[] {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  return members
    .filter((m) => m.dateOfBirth && new Date(m.dateOfBirth).getMonth() === currentMonth)
    .map((m) => {
      const day = new Date(m.dateOfBirth).getDate();
      return {
        _id: m._id,
        firstName: m.firstName,
        profileImage: m.profileImage,
        day,
        isToday: day === currentDay,
      };
    })
    .sort((a, b) => {
      if (a.isToday !== b.isToday) return a.isToday ? -1 : 1;
      return a.day - b.day;
    });
}

export function BirthdayBanner() {
  const styles = useStyles();
  const [members, setMembers] = useState<BirthdayMember[]>([]);

  useEffect(() => {
    MemberServices.listMembers()
      .then((data: IMember[]) => {
        const result = getBirthdaysThisMonth(data);
        setMembers(result.length > 0 ? result : getBirthdaysThisMonth(DEV_MOCK_MEMBERS));
      })
      .catch(() => {
        setMembers(getBirthdaysThisMonth(DEV_MOCK_MEMBERS));
      });
  }, []);

  if (members.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Cake size={14} color={styles.icon.color} />
        <Text style={styles.label}>ANIVERSARIANTES DO MÊS</Text>
      </View>

      <FlatList
        data={members}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={item.isToday ? styles.avatarRing : undefined}>
              <Avatar photo={item.profileImage} size={44} />
              {item.isToday && (
                <View style={styles.todayBadge}>
                  <Text style={styles.todayBadgeText}>🎂</Text>
                </View>
              )}
            </View>
            <Text style={[styles.name, item.isToday && styles.nameToday]} numberOfLines={1}>
              {item.firstName}
            </Text>
            <Text style={[styles.day, item.isToday && styles.dayToday]}>
              {item.isToday ? "hoje!" : `dia ${item.day}`}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
