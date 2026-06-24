import { Header } from "@/components/Header";
import { ItemActionList } from "@/components/ItemActionList";
import { SwipeableTab } from "@/components/SwipeableTab";
import { useAppTheme } from "@/context/ThemeContext";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  HandCoins,
  Mail,
  UserRoundMinus,
  UserRoundPen,
  ShieldCheck,
} from "lucide-react-native";
import React, { useContext, useState } from "react";
import { View } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { ModalChangePasswordMember } from "./ModalChangePasswordMember";
import { ModalEditMemberData } from "./ModalEditMemberData";
import { ModalRegisterCashPayment } from "./ModalRegisterCashPayment";
import { ModalRemoveMember } from "./ModalRemoveMember";
import { ModalSendNotification } from "./ModalSendNotification";
import { useStyles } from "./styles";

export const SettingsScreen = () => {
  const { member } = useContext(AuthContext);
  const { colors } = useAppTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const styles = useStyles();

  const [openRemoveMember, setOpenRemoveMember] = useState(false);
  const [openEditMember, setOpenEditMember] = useState(false);
  const [openEditMemberData, setOpenEditMemberData] = useState(false);
  const [openCashPayment, setOpenCashPayment] = useState(false);
  const [openSendNotification, setOpenSendNotification] = useState(false);

  return (
    <SwipeableTab>
      <View style={styles.container}>
        <Header
          name={member?.firstName + " " + member?.lastName}
          photo={member?.profileImage}
        />

        <View style={[styles.content, { paddingBottom: tabBarHeight }]}>
          <View style={styles.menuCard}>
            <ItemActionList
              title="Remover membro"
              description="Essa funcionalidade permite remover um membro impedindo de não acessar o aplicativo."
              onPress={() => setOpenRemoveMember(true)}
              icon={<UserRoundMinus color={colors.primary} />}
            />

            <ItemActionList
              title="Permissões de membros"
              description="Gerencie quais membros têm acesso de administrador."
              onPress={() => setOpenEditMemberData(true)}
              icon={<ShieldCheck color={colors.primary} />}
            />

            <ItemActionList
              title="Registrar pagamento em dinheiro"
              description="Confirme o recebimento de uma contribuição paga em dinheiro por um membro."
              onPress={() => setOpenCashPayment(true)}
              icon={<HandCoins color={colors.primary} />}
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

          {openEditMemberData && (
            <ModalEditMemberData
              visible={openEditMemberData}
              onClose={() => setOpenEditMemberData(false)}
            />
          )}
          {openCashPayment && (
            <ModalRegisterCashPayment
              visible={openCashPayment}
              onClose={() => setOpenCashPayment(false)}
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
