import { Header } from "@/components/Header";
import { ItemActionList } from "@/components/ItemActionList";
import { SwipeableTab } from "@/components/SwipeableTab";
import { useAppTheme } from "@/context/ThemeContext";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  Mail,
  UserRoundMinus,
  UserRoundPen,
  UserRoundPlus,
} from "lucide-react-native";
import React, { useContext, useState } from "react";
import { View } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { ModalChangePasswordMember } from "./ModalChangePasswordMember";
import { ModalCreateMember } from "./ModalCreateMember";
import { ModalRemoveMember } from "./ModalRemoveMember";
import { ModalSendNotification } from "./ModalSendNotification";
import { useStyles } from "./styles";

export const SettingsScreen = () => {
  const { member } = useContext(AuthContext);
  const { colors } = useAppTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const styles = useStyles();

  const [createMemberModal, setCreateMemberModal] = useState(false);
  const [openRemoveMember, setOpenRemoveMember] = useState(false);
  const [openEditMember, setOpenEditMember] = useState(false);
  const [openSendNotification, setOpenSendNotification] = useState(false);

  return (
    <SwipeableTab>
      <View style={styles.container}>
        <Header name={member?.firstName + " " + member?.lastName} />

        <View style={[styles.content, { paddingBottom: tabBarHeight }]}>
          <View style={styles.menuCard}>
            <ItemActionList
              title="Novo membro"
              description="Essa funcionalidade permite cadastrar novos membros do aplicativo para receberem notificações, realizarem suas contribuições e terem acesso aos dados do aplicativo."
              onPress={() => setCreateMemberModal(true)}
              icon={<UserRoundPlus color={colors.primary} />}
            />

            <ItemActionList
              title="Remover membro"
              description="Essa funcionalidade permite remover um membro impedindo de não acessar o aplicativo."
              onPress={() => setOpenRemoveMember(true)}
              icon={<UserRoundMinus color={colors.primary} />}
            />

            <ItemActionList
              title="Atualizar senha de membro"
              description="Essa funcionalidade permite atualizar a senha de acesso ao aplicativo de um membro caso ela venha a esquecer."
              onPress={() => setOpenEditMember(true)}
              icon={<UserRoundPen color={colors.primary} />}
            />

            <ItemActionList
              title="Enviar notificação"
              description="Envie notificações para os membros da comunidade"
              onPress={() => setOpenSendNotification(true)}
              icon={<Mail color={colors.primary} />}
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
      </View>
    </SwipeableTab>
  );
};
