import React, { useContext, useState } from "react";
import { View } from "react-native";
import { Lock, Send, UserRoundMinus, UserRoundPlus } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { SwipeableTab } from "@/components/SwipeableTab";
import { AuthContext } from "../../context/AuthContext";
import { ModalCreateMember } from "./ModalCreateMember";
import { ItemActionList } from "@/components/ItemActionList";
import { useStyles } from "./styles";
import { Header } from "@/components/Header";
import { ModalRemoveMember } from "./ModalRemoveMember";
import { ModalSendNotification } from "./ModalSendNotification";
import { ModalChangePasswordMember } from "./ModalChangePasswordMember";
import { useAppTheme } from "@/context/ThemeContext";

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
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
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
            icon={<Lock color={colors.primary} />}
          />

          <ItemActionList
            title="Enviar notificação"
            description="Envie notificações para os membros da comunidade"
            onPress={() => setOpenSendNotification(true)}
            icon={<Send color={colors.primary} />}
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
    </SwipeableTab>
  );
};
