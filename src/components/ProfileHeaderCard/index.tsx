import { useAppTheme } from "@/context/ThemeContext";
import { IMember } from "@/types/Member";
import { maskCPFOrCNPJ } from "@/utils/mask";
import { UserRound } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { useStyles } from "./styles";

interface Props {
  member: IMember;
}

export function ProfileHeaderCard({ member }: Props) {
  const { colors } = useAppTheme();
  const styles = useStyles();

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <UserRound size={25} color={colors.primary} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {member.firstName} {member.lastName}
        </Text>
        <Text style={styles.document} numberOfLines={1} ellipsizeMode="tail">
          {maskCPFOrCNPJ(member.identification.numberType, member.identification.type)}
        </Text>
        <Text style={styles.document} numberOfLines={1} ellipsizeMode="tail">
          {member.email}
        </Text>
      </View>
    </View>
  );
}
