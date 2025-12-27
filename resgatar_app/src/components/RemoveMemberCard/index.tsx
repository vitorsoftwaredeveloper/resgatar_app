import React from "react";
import { View, Text, Pressable } from "react-native";
import { Trash2, User as UserIcon } from "lucide-react-native";
import { styles } from "./styles";
import { IMember } from "@/types/Member";
import { COLORS } from "@/theme";

type Props = {
  member: IMember;
  onRemove: (member: IMember) => void;
};

export function RemoveMemberCard({ member, onRemove }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <UserIcon size={20} color="#8C7A6B" />
        </View>

        <View>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.userName}>
            {member?.firstName}
          </Text>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.userEmail}>
            {member?.email}
          </Text>
        </View>
      </View>

      {member.role !== "admin" && (
        <Pressable
          style={styles.deleteButton}
          onPress={() => onRemove(member)}
          hitSlop={8}
        >
          <Trash2 size={20} color={COLORS.error} />
        </Pressable>
      )}
    </View>
  );
}
