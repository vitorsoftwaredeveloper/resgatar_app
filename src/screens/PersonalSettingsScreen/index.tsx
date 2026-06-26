import { Header } from "@/components/Header";
import { ItemActionList } from "@/components/ItemActionList";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { RootStackParamList } from "@/navigation/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Lock, Trash2, UserRoundCog } from "lucide-react-native";
import React, { useContext, useState } from "react";
import { Text, View } from "react-native";
import { ModalDeleteAccount } from "../ProfileScreen/ModalDeleteAccount";
import { ModalEditProfile } from "../ProfileScreen/ModalEditProfile";
import { ModalUpdatePassword } from "../ProfileScreen/ModalUpdatePassword";
import { useStyles } from "./styles";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "PersonalSettings">;
}

export function PersonalSettingsScreen({ navigation }: Props) {
  const { member } = useContext(AuthContext);
  const { colors } = useAppTheme();
  const { bottom } = useSafeAreaInsets();
  const styles = useStyles();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [deleteAccountVisible, setDeleteAccountVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Header
        name={member?.firstName + " " + member?.lastName}
        photo={member?.profileImage}
        onBack={() => navigation.goBack()}
      />

      <View style={[styles.content, { paddingBottom: bottom + 16 }]}>
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>Configurações pessoais</Text>
          <View style={styles.menuCard}>
            <ItemActionList
              title="Meus dados"
              description="Visualize ou edite seus dados pessoais"
              onPress={() => setEditModalVisible(true)}
              icon={<UserRoundCog color={colors.primary} />}
            />

            <ItemActionList
              title="Atualizar senha"
              description="Atualize sua senha de login do aplicativo"
              onPress={() => setPasswordModalVisible(true)}
              icon={<Lock color={colors.primary} />}
            />

            <ItemActionList
              title="Encerrar conta"
              description="Remova permanentemente sua conta e dados"
              onPress={() => setDeleteAccountVisible(true)}
              icon={<Trash2 color={colors.primary} />}
              isLast
            />
          </View>
        </View>
      </View>

      {editModalVisible && (
        <ModalEditProfile
          editModalVisible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
        />
      )}

      {passwordModalVisible && (
        <ModalUpdatePassword
          passwordModalVisible={passwordModalVisible}
          onClose={() => setPasswordModalVisible(false)}
        />
      )}

      {deleteAccountVisible && (
        <ModalDeleteAccount
          visible={deleteAccountVisible}
          onClose={() => setDeleteAccountVisible(false)}
        />
      )}
    </View>
  );
}
