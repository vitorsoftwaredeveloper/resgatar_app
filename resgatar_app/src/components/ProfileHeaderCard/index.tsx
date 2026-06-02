import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import { COLORS } from "@/theme";
import { UserIcon } from "lucide-react-native";
import { IMember } from "@/types/Member";

interface Props {
  member: IMember;
}

export function ProfileHeaderCard({ member }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <UserIcon size={25} color={COLORS.primary} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {member.firstName} {member.lastName}
        </Text>
        <Text style={styles.document} numberOfLines={1} ellipsizeMode="tail">
          {member.identification.numberType}
        </Text>
        <Text style={styles.document} numberOfLines={1} ellipsizeMode="tail">
          {member.email}
        </Text>
      </View>
    </View>
  );
}
