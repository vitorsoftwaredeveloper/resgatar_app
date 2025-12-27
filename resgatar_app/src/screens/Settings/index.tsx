import React, { useContext, useState } from "react";
import { View } from "react-native";
import { Bell, UserRoundMinus, UserRoundPlus } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../context/AuthContext";
import { ModalCreateMember } from "./ModalCreateMember";
import { ProfileMenuItem } from "@/components/ProfileMenuItem";
import { ProfileHeaderCard } from "@/components/ProfileHeaderCard";
import { styles } from "./styles";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ModalRemoveMember } from "./ModalRemoveMember";

export const SettingsScreen = () => {
  const { member } = useContext(AuthContext);

  const [createMemberModal, setCreateMemberModal] = useState(false);
  const [openRemoveMember, setOpenRemoveMember] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader name={member?.firstName as string} />

      <View style={styles.content}>
        <ProfileHeaderCard
          name={`${member?.firstName} ${member?.lastName}`}
          document={`${member?.identification?.type}: ${member?.identification?.numberType}`}
        />
        <View style={styles.menuCard}>
          <ProfileMenuItem
            title="Cadastrar novo usuário"
            description="Essa funcionalidade permite cadastrar novos usuários do aplicativo para receberem notificações, realizarem suas contribuições e terem acesso aos dados do aplicativo."
            onPress={() => setCreateMemberModal(true)}
            icon={<UserRoundPlus />}
          />

          <ProfileMenuItem
            title="Remover usuário"
            description="Essa funcionalidade permite remover um usuário impedindo de não acessar o aplicativo"
            onPress={() => setOpenRemoveMember(true)}
            icon={<UserRoundMinus />}
          />

          <ProfileMenuItem
            title="Enviar notificação"
            description="Envie novas notificações"
            onPress={() => {}}
            icon={<Bell />}
            isLast
          />
        </View>
        {createMemberModal && (
          <ModalCreateMember
            createMemberModal={createMemberModal}
            onClose={() => setCreateMemberModal(false)}
          />
        )}
        {openRemoveMember && (
          <ModalRemoveMember
            visible={openRemoveMember}
            onClose={() => setOpenRemoveMember(false)}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
