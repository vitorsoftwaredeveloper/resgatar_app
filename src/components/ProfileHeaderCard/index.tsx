import { Avatar } from "@/components/Avatar";
import { CoachTarget } from "@/components/CoachTarget";
import { IMember } from "@/types/Member";
import { maskCPFOrCNPJ } from "@/utils/mask";
import React from "react";
import { Text, View } from "react-native";
import { useStyles } from "./styles";

interface Props {
  member: IMember;
  onPressAvatar?: () => void;
}

export function ProfileHeaderCard({ member, onPressAvatar }: Props) {
  const styles = useStyles();

  return (
    <View style={styles.card}>
      <CoachTarget id="profile-photo" style={styles.avatarWrapper}>
        <Avatar
          photo={member.profileImage}
          size={56}
          onPress={onPressAvatar}
          editable={!!onPressAvatar}
        />
      </CoachTarget>

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
