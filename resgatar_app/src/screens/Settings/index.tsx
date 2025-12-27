import React, { useContext, useState } from "react";
import { View } from "react-native";
import { User, Bell } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../context/AuthContext";
import { ModalCreateMember } from "./ModalCreateMember";
import { ProfileMenuItem } from "@/components/ProfileMenuItem";
import { ProfileHeaderCard } from "@/components/ProfileHeaderCard";
import { styles } from "./styles";
import { DashboardHeader } from "@/components/DashboardHeader";

export const SettingsScreen = () => {
  const { member } = useContext(AuthContext);

  const [createMemberModal, setCreateMemberModal] = useState(false);

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
            description="Permita novos usuários acessarem o app"
            onPress={() => setCreateMemberModal(true)}
            icon={<User />}
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
            setCreateMemberModal={setCreateMemberModal}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
