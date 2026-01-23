import React, { useContext, useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { Dialog } from "@/components/Dialog";
import { RemoveMemberSkeleton } from "@/components/Skeleton/RemoveMemberSkeleton";
import { Trash2 } from "lucide-react-native";
import { styles } from "./styles";
import { AuthContext } from "@/context/AuthContext";
import { IMember } from "@/types/Member";
import { ToastMessage } from "@/components/Toast";
import { COLORS } from "@/theme";
import { SettingsMemberCard } from "@/components/SettingsMemberCard";
import { ModalBase } from "@/components/ModalBase";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function ModalRemoveMember({ visible, onClose }: Props) {
  const [members, setMembers] = useState<IMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<IMember | null>(null);
  const { listMembers, removeMember } = useContext(AuthContext);
  const [openDialog, setOpenDialog] = useState(false);

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

  async function handleConfirmRemove() {
    if (!selectedMember) return;

    await removeMember(selectedMember._id)
      .then(() => {
        ToastMessage.success("Membro removido com sucesso!");
        loadMembers();
      })
      .catch(() => {
        ToastMessage.error("Erro", "Falha ao remover membro.");
      })
      .finally(() => {
        setSelectedMember(null);
        setOpenDialog(false);
      });
  }

  const handleSelectMember = (member: IMember) => {
    setSelectedMember(member);
    setOpenDialog(true);
  };

  useEffect(() => {
    if (!visible) return;
    loadMembers();
  }, [visible]);

  return (
    <ModalBase onClose={onClose} visible={visible} title="Remover membro">
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
                  iconAction={<Trash2 size={20} color={COLORS.error} />}
                  variant="delete"
                />
              )
            }
            contentContainerStyle={styles.listContent}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
      <Dialog
        visible={openDialog}
        title="Confirmar remoção"
        description={`Tem certeza que deseja remover o membro ${selectedMember?.firstName}? Esta ação não pode ser desfeita.`}
        onClose={() => setOpenDialog(false)}
        actions={[
          {
            label: "cancelar",
            variant: "secondary",
            onPress: () => setOpenDialog(false),
          },
          {
            label: "remover",
            variant: "primary",
            onPress: handleConfirmRemove,
          },
        ]}
      />
    </ModalBase>
  );
}
