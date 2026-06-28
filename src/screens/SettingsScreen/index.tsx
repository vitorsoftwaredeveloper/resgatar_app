import { Header } from "@/components/Header";
import { ItemActionList } from "@/components/ItemActionList";
import { useAppTheme } from "@/context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import {
  CalendarRange,
  Gift,
  Mail,
  PiggyBank,
  Receipt,
  UsersRound,
} from "lucide-react-native";
import React, { useContext, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { ModalSendNotification } from "./ModalSendNotification";
import { useStyles } from "./styles";

export const SettingsScreen = () => {
  const { member } = useContext(AuthContext);
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [openSendNotification, setOpenSendNotification] = useState(false);

  return (
    <View style={styles.container}>
      <Header
        name={member?.firstName + " " + member?.lastName}
        photo={member?.profileImage}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 16, gap: 16 },
        ]}
        showsVerticalScrollIndicator={false}
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
              />
              <ItemActionList
                title="Listagem de doações"
                description="Veja todas as doações avulsas do ano por membro, valor e forma de pagamento."
                onPress={() => navigation.navigate("Donations")}
                icon={<Gift color={colors.primary} />}
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
      </ScrollView>

      {openSendNotification && (
        <ModalSendNotification
          visible={openSendNotification}
          onClose={() => setOpenSendNotification(false)}
        />
      )}
    </View>
  );
};
