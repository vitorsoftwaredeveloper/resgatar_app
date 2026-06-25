import { Header } from "@/components/Header";
import { ItemActionList } from "@/components/ItemActionList";
import { SwipeableTab } from "@/components/SwipeableTab";
import { useAppTheme } from "@/context/ThemeContext";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { Mail, PiggyBank, UsersRound } from "lucide-react-native";
import React, { useContext, useState } from "react";
import { View } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { ModalSendNotification } from "./ModalSendNotification";
import { useStyles } from "./styles";

export const SettingsScreen = () => {
  const { member } = useContext(AuthContext);
  const { colors } = useAppTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const styles = useStyles();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
              title="Painel de arrecadação"
              description="Acompanhe os pagamentos do mês: quem pagou, inadimplentes, total arrecadado e o quanto falta para a meta."
              onPress={() => navigation.navigate("Arrecadacao")}
              icon={<PiggyBank color={colors.primary} />}
            />

            <ItemActionList
              title="Gestão de membros"
              description="Remova membros, gerencie permissões, registre pagamentos e atualize senhas."
              onPress={() => navigation.navigate("MemberActions")}
              icon={<UsersRound color={colors.primary} />}
            />

            <ItemActionList
              title="Enviar notificação"
              description="Envie notificações para os membros da comunidade"
              onPress={() => setOpenSendNotification(true)}
              icon={<Mail color={colors.primary} />}
              isLast
            />
          </View>

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
