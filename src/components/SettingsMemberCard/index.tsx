import React from "react";
import { ActivityIndicator, View, Text, Pressable } from "react-native";
import { Avatar } from "@/components/Avatar";
import { useAppTheme } from "@/context/ThemeContext";
import { useStyles } from "./styles";
import { IMember } from "@/types/Member";

type Props = {
  member: IMember;
  onAction: (member: IMember) => void;
  iconAction: React.ReactNode;
  variant?: "delete" | "edit";
  loading?: boolean;
};

export function SettingsMemberCard({
  member,
  onAction,
  iconAction,
  variant = "edit",
  loading = false,
}: Props) {
  const styles = useStyles();
  const { colors } = useAppTheme();

  return (
    <View style={styles.card}>
      <View style={styles.userInfo}>
        <Avatar photo={member.profileImage} size={40} />

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
        onPress={() => !loading && onAction(member)}
        hitSlop={8}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          iconAction
        )}
      </Pressable>
    </View>
  );
}
