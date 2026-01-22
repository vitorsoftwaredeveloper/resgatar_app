import React, { useContext, useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { RemoveMemberSkeleton } from "@/components/Skeleton/RemoveMemberSkeleton";
import { Edit } from "lucide-react-native";
import { styles } from "./styles";
import { AuthContext } from "@/context/AuthContext";
import { IMember } from "@/types/Member";
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
  const { listMembers } = useContext(AuthContext);
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
    <ModalBase onClose={onClose} visible={visible} title="Atualizar senha">
      <View style={styles.overlay}>
        <View style={styles.container}>
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
