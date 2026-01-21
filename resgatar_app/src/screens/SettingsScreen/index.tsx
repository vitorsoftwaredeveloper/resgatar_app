import React, { useContext, useState } from "react";
import { View } from "react-native";
import {
  Lock,
  Send,
  UserRoundMinus,
  UserRoundPen,
  UserRoundPlus,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../context/AuthContext";
import { ModalCreateMember } from "./ModalCreateMember";
import { ItemActionList } from "@/components/ItemActionList";
import { styles } from "./styles";
import { Header } from "@/components/Header";
import { ModalRemoveMember } from "./ModalRemoveMember";
import { ModalSendNotification } from "./ModalSendNotification";
import { ModalChangePasswordMember } from "./ModalChangePasswordMember";

export const SettingsScreen = () => {
  const { member } = useContext(AuthContext);

  const [createMemberModal, setCreateMemberModal] = useState(false);
  const [openRemoveMember, setOpenRemoveMember] = useState(false);
  const [openEditMember, setOpenEditMember] = useState(false);
  const [openSendNotification, setOpenSendNotification] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Header name={member?.firstName as string} />

      <View style={styles.content}>
        <View style={styles.menuCard}>
          <ItemActionList
            title="Cadastrar novo membro"
            description="Essa funcionalidade permite cadastrar novos membros do aplicativo para receberem notificações, realizarem suas contribuições e terem acesso aos dados do aplicativo."
            onPress={() => setCreateMemberModal(true)}
            icon={<UserRoundPlus />}
          />

          <ItemActionList
            title="Remover membro"
            description="Essa funcionalidade permite remover um membro impedindo de não acessar o aplicativo."
            onPress={() => setOpenRemoveMember(true)}
            icon={<UserRoundMinus />}
          />

          <ItemActionList
            title="Atualizar senha de membro"
            description="Essa funcionalidade permite atualizar a senha de acesso ao aplicativo de um membro caso ela venha a esquecer."
            onPress={() => setOpenEditMember(true)}
            icon={<Lock />}
          />

          <ItemActionList
            title="Enviar notificação"
            description="Envie notificações para os membros da comunidade"
            onPress={() => setOpenSendNotification(true)}
            icon={<Send />}
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
        {openEditMember && (
          <ModalChangePasswordMember
            visible={openEditMember}
            onClose={() => setOpenEditMember(false)}
          />
        )}
        {openSendNotification && (
          <ModalSendNotification
            visible={openSendNotification}
            onClose={() => setOpenSendNotification(false)}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
