import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Dialog } from "@/components/Dialog";
import { RemoveMemberSkeleton } from "@/components/Skeleton/RemoveMemberSkeleton";
import { X } from "lucide-react-native";
import { styles } from "./styles";
import { AuthContext } from "@/context/AuthContext";
import { IMember } from "@/types/Member";
import { ToastMessage } from "@/components/Toast";
import { IconButton } from "@/components/IconButton";
import { COLORS } from "@/theme";
import { RemoveMemberCard } from "@/components/RemoveMemberCard";
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

  async function handleConfirmRemove() {
    if (!selectedMember) return;

    await removeMember(selectedMember._id)
      .then(() => {
        ToastMessage.success("Sucesso", "Usuário removido com sucesso!");
      })
      .catch(() => {
        ToastMessage.error("Erro", "Falha ao remover usuário.");
      })
      .finally(() => {
        setSelectedMember(null);
        setOpenDialog(false);
        onClose();
      });
  }

  const handleSelectMember = (member: IMember) => {
    setSelectedMember(member);
    setOpenDialog(true);
  };

  return (
    <ModalBase onClose={onClose} visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Remover usuário</Text>

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
                <RemoveMemberCard member={item} onRemove={handleSelectMember} />
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
        description={`Tem certeza que deseja remover o usuário ${selectedMember?.firstName}? Esta ação não pode ser desfeita.`}
        onClose={() => setOpenDialog(false)}
        actions={[
          {
            label: "cancelar",
            variant: "secondary",
            onPress: () => setOpenDialog(false),
          },
          {
            label: "remover",
            variant: "danger",
            onPress: handleConfirmRemove,
          },
        ]}
      />
    </ModalBase>
  );
}
