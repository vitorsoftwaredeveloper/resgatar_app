import { Header } from "@/components/Header";
import { ItemActionList } from "@/components/ItemActionList";
import { SwipeableTab } from "@/components/SwipeableTab";
import { useAppTheme } from "@/context/ThemeContext";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import {
  CalendarRange,
  Mail,
  PiggyBank,
  Receipt,
  UsersRound,
} from "lucide-react-native";
import React, { useContext, useState } from "react";
import { View, Text } from "react-native";
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

        <View
          style={[styles.content, { paddingBottom: tabBarHeight, gap: 16 }]}
        >
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionLabel}>Financeiro</Text>
            <View style={styles.menuCard}>
              <ItemActionList
                title="Entrada mensal"
                description="Acompanhe os pagamentos do mês: quem pagou, inadimplentes, total arrecadado e o quanto falta para a meta."
                onPress={() => navigation.navigate("Arrecadacao")}
                icon={<PiggyBank color={colors.primary} />}
              />
              <ItemActionList
                title="Balanço anual"
                description="Fechamento do ano: total arrecadado, mês a mês e a situação de cada membro."
                onPress={() => navigation.navigate("BalancoAnual")}
                icon={<CalendarRange color={colors.primary} />}
              />
              <ItemActionList
                title="Despesa mensal"
                description="Registre e acompanhe as saídas de caixa do mês por categoria."
                onPress={() => navigation.navigate("Expenses")}
                icon={<Receipt color={colors.primary} />}
                isLast
              />
            </View>
          </View>

          <View style={styles.sectionGroup}>
            <Text style={styles.sectionLabel}>Administração</Text>
            <View style={styles.menuCard}>
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
