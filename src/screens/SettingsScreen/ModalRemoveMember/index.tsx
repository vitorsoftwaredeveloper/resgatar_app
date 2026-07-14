import { Dialog } from "@/components/Dialog";
import { MemberListWithSkeleton } from "@/components/Skeleton/MemberListWithSkeleton";
import { ModalBase } from "@/components/ModalBase";
import { ToastMessage } from "@/components/Toast";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { IMember } from "@/types/Member";
import { Trash2 } from "lucide-react-native";
import React, { useContext, useEffect, useState } from "react";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function ModalRemoveMember({ visible, onClose }: Props) {
  const { colors } = useAppTheme();
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
      <MemberListWithSkeleton
        members={members}
        loading={loading}
        onAction={handleSelectMember}
        iconAction={<Trash2 size={20} color={colors.primary} />}
        variant="delete"
      />
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
