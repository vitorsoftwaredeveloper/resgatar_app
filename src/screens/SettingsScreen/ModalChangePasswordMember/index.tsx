import React, { useContext, useEffect, useState } from "react";
import { Edit } from "lucide-react-native";
import { AuthContext } from "@/context/AuthContext";
import { IMember } from "@/types/Member";
import { useAppTheme } from "@/context/ThemeContext";
import { ModalBase } from "@/components/ModalBase";
import { ModalUpdatePassword } from "@/screens/ProfileScreen/ModalUpdatePassword";
import { MemberListWithSkeleton } from "@/components/Skeleton/MemberListWithSkeleton";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function ModalChangePasswordMember({ visible, onClose }: Props) {
  const { colors } = useAppTheme();
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
      <MemberListWithSkeleton
        members={members}
        loading={loading}
        onAction={handleSelectMember}
        iconAction={<Edit size={20} color={colors.primary} />}
        variant="edit"
      />
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
