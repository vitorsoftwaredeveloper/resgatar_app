import { ModalBase } from "@/components/ModalBase";
import { RemoveMemberSkeleton } from "@/components/Skeleton/RemoveMemberSkeleton";
import { ToastMessage } from "@/components/Toast";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { MemberServices } from "@/services/MemberService";
import { IMember } from "@/types/Member";
import { Avatar } from "@/components/Avatar";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Switch,
  Text,
  View,
} from "react-native";
import { useStyles } from "./styles";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const SKELETON_COUNT = 4;

export function ModalEditMemberData({ visible, onClose }: Props) {
  const [members, setMembers] = useState<IMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const { listMembers, member: loggedMember, reloadMemberData } = useContext(AuthContext);
  const { colors } = useAppTheme();
  const styles = useStyles();

  useEffect(() => {
    if (!visible) return;
    loadMembers();
  }, [visible]);

  async function loadMembers() {
    setLoading(true);
    try {
      const response = await listMembers();
      setMembers(response as any);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleRole(member: IMember, value: boolean) {
    const newRole = value ? "admin" : "user";
    setUpdating(member._id);
    try {
      await MemberServices.editMember({ _id: member._id, role: newRole } as any);
      setMembers((prev) =>
        prev.map((m) => (m._id === member._id ? { ...m, role: newRole } : m)),
      );
      if (member._id === loggedMember?._id) {
        await reloadMemberData();
      }
    } catch {
      ToastMessage.error("Erro", "Falha ao atualizar permissão.");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <ModalBase onClose={onClose} visible={visible} title="Permissões de membros">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <FlatList
            data={loading ? Array.from({ length: SKELETON_COUNT }) : members}
            keyExtractor={(_, index) =>
              loading ? `skeleton-${index}` : members[index]._id
            }
            renderItem={({ item }: any) =>
              loading ? (
                <RemoveMemberSkeleton />
              ) : (
                <View style={styles.card}>
                  <View style={styles.userInfo}>
                    <Avatar photo={item.profileImage} size={40} />
                    <View>
                      <Text style={styles.userName} numberOfLines={1}>
                        {item.firstName}
                      </Text>
                      <Text style={styles.userEmail} numberOfLines={1}>
                        {item.email}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.action}>
                    {updating === item._id ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                      <Switch
                        value={item.role === "admin"}
                        onValueChange={(value) => handleToggleRole(item, value)}
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor="#fff"
                      />
                    )}
                  </View>
                </View>
              )
            }
            contentContainerStyle={styles.listContent}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </ModalBase>
  );
}
