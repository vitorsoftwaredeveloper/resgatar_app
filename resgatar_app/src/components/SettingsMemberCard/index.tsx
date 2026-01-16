import React from "react";
import { View, Text, Pressable } from "react-native";
import { User as UserIcon } from "lucide-react-native";
import { styles } from "./styles";
import { IMember } from "@/types/Member";
import { COLORS } from "@/theme";
import { Badge } from "../Badge";

type Props = {
  member: IMember;
  onAction: (member: IMember) => void;
  iconAction: React.ReactNode;
  variant?: "delete" | "edit";
};

export function SettingsMemberCard({
  member,
  onAction,
  iconAction,
  variant = "edit",
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <UserIcon size={20} color={COLORS.primary} />
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
      <Pressable
        style={styles[variant]}
        onPress={() => onAction(member)}
        hitSlop={8}
      >
        {iconAction}
      </Pressable>
    </View>
  );
}
