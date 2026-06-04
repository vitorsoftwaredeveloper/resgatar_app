import React from "react";
import { View, Text, Pressable } from "react-native";
import { User as UserIcon } from "lucide-react-native";
import { useStyles } from "./styles";
import { useAppTheme } from "@/context/ThemeContext";
import { IMember } from "@/types/Member";

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
  const { colors } = useAppTheme();
  const styles = useStyles();

  return (
    <View style={styles.card}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <UserIcon size={20} color={colors.primary} />
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
