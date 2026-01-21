import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { User, Lock } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../context/AuthContext";
import { ModalEditProfile } from "./ModalEditProfile";
import { ModalUpdatePassword } from "./ModalUpdatePassword";
import { ItemActionList } from "@/components/ItemActionList";
import { ProfileHeaderCard } from "@/components/ProfileHeaderCard";
import { styles } from "./styles";
import { Header } from "@/components/Header";
import { Dialog } from "@/components/Dialog";
import { IMember } from "@/types/Member";
import { COLORS } from "@/theme";

export const ProfileScreen = () => {
  const { logout, member } = useContext(AuthContext);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [dialogLogoutVisible, setDialogLogoutVisible] = useState(false);

  const handleLgout = async () => {
    await logout();
    setDialogLogoutVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header name={member?.firstName as string} />

      <View style={styles.content}>
        <ProfileHeaderCard member={member as IMember} />

        <View style={styles.menuCard}>
          <ItemActionList
            title="Meus dados"
            description="Visualize ou edite seus dados pessoais"
            onPress={() => setEditModalVisible(true)}
            icon={<User color={COLORS.primary} />}
          />

          <ItemActionList
            title="Atualizar senha"
            description="Atualize sua senha de login do aplicativo"
            onPress={() => setPasswordModalVisible(true)}
            icon={<Lock color={COLORS.primary} />}
            isLast
          />

          {/* <ItemActionList
            title="Minhas notificações"
            description="Acompanhe suas notificações"
            onPress={() => {}}
            icon={<Bell />}
          />

          <ItemActionList
            title="Meus compromissos"
            description="Compromissos e pendências"
            onPress={() => {}}
            icon={<ClipboardList />}
          />

          <ItemActionList
            title="Política de Privacidade"
            description="Veja nossa política de privacidade"
            onPress={() => {}}
            icon={<Lock />}
          />

          <ItemActionList
            title="Sobre"
            description="Sobre a Comunidade Resgatar"
            onPress={() => {}}
            icon={<Church />}
            isLast
          /> */}
        </View>

        <TouchableOpacity
          style={styles.logout}
          onPress={() => setDialogLogoutVisible(true)}
        >
          <Text style={styles.logoutText}>⎋ Sair</Text>
        </TouchableOpacity>

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

        {dialogLogoutVisible && (
          <Dialog
            visible={dialogLogoutVisible}
            title="Tem certeza que deseja sair?"
            onClose={() => setDialogLogoutVisible(false)}
            actions={[
              {
                label: "cancelar",
                onPress: () => setDialogLogoutVisible(false),
                variant: "secondary",
              },
              {
                label: "sair",
                onPress: handleLgout,
                variant: "primary",
              },
            ]}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
