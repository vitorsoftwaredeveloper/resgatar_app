import { Header } from "@/components/Header";
import { ItemActionList } from "@/components/ItemActionList";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { RootStackParamList } from "@/navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  HandCoins,
  ShieldCheck,
  UserRoundMinus,
  UserRoundPen,
} from "lucide-react-native";
import React, { useContext, useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ModalChangePasswordMember } from "@/screens/SettingsScreen/ModalChangePasswordMember";
import { ModalEditMemberData } from "@/screens/SettingsScreen/ModalEditMemberData";
import { ModalRegisterCashPayment } from "@/screens/SettingsScreen/ModalRegisterCashPayment";
import { ModalRemoveMember } from "@/screens/SettingsScreen/ModalRemoveMember";
import { useStyles } from "./styles";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "MemberActions">;
}

export function MemberActionsScreen({ navigation }: Props) {
  const { member } = useContext(AuthContext);
  const { colors } = useAppTheme();
  const { bottom } = useSafeAreaInsets();
  const styles = useStyles();

  const [openRemoveMember, setOpenRemoveMember] = useState(false);
  const [openEditMemberData, setOpenEditMemberData] = useState(false);
  const [openCashPayment, setOpenCashPayment] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);

  return (
    <View style={styles.container}>
      <Header
        name={member?.firstName + " " + member?.lastName}
        photo={member?.profileImage}
        onBack={() => navigation.goBack()}
      />

      <View style={[styles.content, { paddingBottom: bottom + 16 }]}>
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>Gestão de membros</Text>
          <View style={styles.menuCard}>
            <ItemActionList
              title="Remover membro"
              description="Remova um membro impedindo o acesso ao aplicativo."
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
              description="Confirme o recebimento de uma contribuição paga em dinheiro."
              onPress={() => setOpenCashPayment(true)}
              icon={<HandCoins color={colors.primary} />}
            />

            <ItemActionList
              title="Atualizar senha de membro"
              description="Atualize a senha de acesso de um membro ao aplicativo."
              onPress={() => setOpenChangePassword(true)}
              icon={<UserRoundPen color={colors.primary} />}
              isLast
            />
          </View>
        </View>
      </View>

      {openRemoveMember && (
        <ModalRemoveMember
          visible={openRemoveMember}
          onClose={() => setOpenRemoveMember(false)}
        />
      )}

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

      {openChangePassword && (
        <ModalChangePasswordMember
          visible={openChangePassword}
          onClose={() => setOpenChangePassword(false)}
        />
      )}
    </View>
  );
}
