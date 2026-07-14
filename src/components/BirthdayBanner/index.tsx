import { Avatar } from "@/components/Avatar";
import { useAppTheme } from "@/context/ThemeContext";
import { MemberServices } from "@/services/MemberService";
import { IMember } from "@/types/Member";
import { PartyPopper } from "lucide-react-native";
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
      {
        _id: "m1",
        firstName: "Ana",
        lastName: "Silva",
        dateOfBirth: new Date(1990, 5, 3).getTime(),
        email: "",
        phoneNumber: "",
        paymentInfo: { datePayment: 1, amount: "0" },
        identification: { type: "CPF", numberType: "" },
      },
      {
        _id: "m2",
        firstName: "Carlos",
        lastName: "Souza",
        dateOfBirth: new Date(1985, 5, 10).getTime(),
        email: "",
        phoneNumber: "",
        paymentInfo: { datePayment: 1, amount: "0" },
        identification: { type: "CPF", numberType: "" },
      },
      {
        _id: "m3",
        firstName: "Fernanda",
        lastName: "Lima",
        dateOfBirth: new Date(1993, 5, 15).getTime(),
        email: "",
        phoneNumber: "",
        paymentInfo: { datePayment: 1, amount: "0" },
        identification: { type: "CPF", numberType: "" },
      },
      {
        _id: "m4",
        firstName: "Vitor",
        lastName: "Silva",
        dateOfBirth: new Date(1997, 5, 23).getTime(),
        email: "",
        phoneNumber: "",
        paymentInfo: { datePayment: 1, amount: "0" },
        identification: { type: "CPF", numberType: "" },
      },
      {
        _id: "m5",
        firstName: "Roberto",
        lastName: "Costa",
        dateOfBirth: new Date(1978, 5, 20).getTime(),
        email: "",
        phoneNumber: "",
        paymentInfo: { datePayment: 1, amount: "0" },
        identification: { type: "CPF", numberType: "" },
      },
      {
        _id: "m6",
        firstName: "Juliana",
        lastName: "Ferreira",
        dateOfBirth: new Date(2000, 5, 28).getTime(),
        email: "",
        phoneNumber: "",
        paymentInfo: { datePayment: 1, amount: "0" },
        identification: { type: "CPF", numberType: "" },
      },
    ]
  : [];

// dateOfBirth vem como epoch (number) ou, às vezes, como string numérica —
// new Date(string) tenta interpretar como data por extenso e cai em Invalid
// Date, fazendo o membro sumir da lista. Mesmo parsing "número ou string" do
// resgatar-browser.
function parseBirthDate(dateOfBirth: string | number): Date | null {
  if (!dateOfBirth) return null;
  const numeric = Number(dateOfBirth);
  const ts = !isNaN(numeric) ? numeric : Date.parse(String(dateOfBirth));
  if (isNaN(ts)) return null;
  return new Date(ts);
}

function getBirthdaysThisMonth(members: IMember[]): BirthdayMember[] {
  const now = new Date();
  const currentMonth = now.getUTCMonth();
  const currentDay = now.getUTCDate();
  return members
    .map((m): BirthdayMember | null => {
      const date = parseBirthDate(m.dateOfBirth);
      if (!date || date.getUTCMonth() !== currentMonth) return null;
      const day = date.getUTCDate();
      return {
        _id: m._id,
        firstName: m.firstName,
        profileImage: m.profileImage,
        day,
        isToday: day === currentDay,
      };
    })
    .filter((m): m is BirthdayMember => m !== null)
    .sort((a, b) => {
      if (a.isToday !== b.isToday) return a.isToday ? -1 : 1;
      return a.day - b.day;
    });
}

export function BirthdayBanner() {
  const styles = useStyles();
  const { colors } = useAppTheme();
  const [members, setMembers] = useState<BirthdayMember[]>([]);

  useEffect(() => {
    // /members/birthdays (e não /members/list, que é admin-only e devolvia 401
    // para membro comum): já vem filtrado pelo mês e só com os campos públicos.
    MemberServices.listBirthdayMembers()
      .then((data: IMember[]) => {
        const result = getBirthdaysThisMonth(data);
        setMembers(
          result.length > 0 ? result : getBirthdaysThisMonth(DEV_MOCK_MEMBERS),
        );
      })
      .catch(() => {
        setMembers(getBirthdaysThisMonth(DEV_MOCK_MEMBERS));
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>ANIVERSARIANTES DO MÊS</Text>
      </View>

      {members.length === 0 ? (
        <View style={styles.emptyState}>
          <PartyPopper size={22} color={colors.textMuted} />
          <Text style={styles.emptyText}>Nenhum aniversariante este mês</Text>
        </View>
      ) : (
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
              <Text
                style={[styles.name, item.isToday && styles.nameToday]}
                numberOfLines={1}
              >
                {item.firstName}
              </Text>
              <Text style={[styles.day, item.isToday && styles.dayToday]}>
                {item.isToday ? "hoje!" : `dia ${item.day}`}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
