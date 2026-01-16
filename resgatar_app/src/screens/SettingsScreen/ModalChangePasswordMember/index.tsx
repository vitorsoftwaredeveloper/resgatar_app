import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { RemoveMemberSkeleton } from "@/components/Skeleton/RemoveMemberSkeleton";
import { Edit, X } from "lucide-react-native";
import { styles } from "./styles";
import { AuthContext } from "@/context/AuthContext";
import { IMember } from "@/types/Member";
import { ToastMessage } from "@/components/Toast";
import { IconButton } from "@/components/IconButton";
import { COLORS } from "@/theme";
import { SettingsMemberCard } from "@/components/SettingsMemberCard";
import { ModalBase } from "@/components/ModalBase";
import { ModalUpdatePassword } from "@/screens/ProfileScreen/ModalUpdatePassword";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function ModalChangePasswordMember({ visible, onClose }: Props) {
  const [members, setMembers] = useState<IMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<IMember | null>(null);
  const { listMembers, removeMember } = useContext(AuthContext);
  const [openChangePassword, setOpenChangePassword] = useState(false);

  useEffect(() => {
    if (!visible) return;

    loadMembers();
  }, [visible]);

  async function loadMembers() {
    setLoading(true);

    try {
      await listMembers().then((response) => {
        setMembers(response as any);
      });
    } finally {
      setLoading(false);
    }
  }

  const handleSelectMember = (member: IMember) => {
    setSelectedMember(member);
    setOpenChangePassword(true);
  };

  return (
    <ModalBase onClose={onClose} visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Atualizar senha</Text>

            <IconButton color={COLORS.white} icon={X} onPress={onClose} />
          </View>

          <FlatList
            data={loading ? Array.from({ length: 4 }) : members}
            keyExtractor={(_, index) =>
              loading ? `skeleton-${index}` : members[index]._id
            }
            renderItem={({ item }: any) =>
              loading ? (
                <RemoveMemberSkeleton />
              ) : (
                <SettingsMemberCard
                  member={item}
                  onAction={handleSelectMember}
                  iconAction={<Edit size={20} color={COLORS.primary} />}
                  variant="edit"
                />
              )
            }
            contentContainerStyle={styles.listContent}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
      {openChangePassword && (
        <ModalUpdatePassword
          passwordModalVisible={openChangePassword}
          onClose={() => setOpenChangePassword(false)}
          memberIdPasswordWillBeChanged={selectedMember?._id}
        />
      )}
    </ModalBase>
  );
}
