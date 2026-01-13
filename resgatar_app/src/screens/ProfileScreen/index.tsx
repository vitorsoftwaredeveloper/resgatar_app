import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { User, Lock } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../context/AuthContext";
import { ModalEditProfile } from "./ModalEditProfile";
import { ModalUpdatePassword } from "./ModalUpdatePassword";
import { ProfileMenuItem } from "@/components/ProfileMenuItem";
import { ProfileHeaderCard } from "@/components/ProfileHeaderCard";
import { styles } from "./styles";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Dialog } from "@/components/Dialog";

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
      <DashboardHeader name={member?.firstName as string} />

      <View style={styles.content}>
        <ProfileHeaderCard
          name={`${member?.firstName} ${member?.lastName}`}
          document={`${member?.identification?.type}: ${member?.identification?.numberType}`}
        />

        <View style={styles.menuCard}>
          <ProfileMenuItem
            title="Meus dados"
            description="Visualize ou edite seus dados"
            onPress={() => setEditModalVisible(true)}
            icon={<User />}
          />

          <ProfileMenuItem
            title="Alterar senha"
            description="Atualize sua senha de login do aplicativo"
            onPress={() => setPasswordModalVisible(true)}
            icon={<Lock />}
            isLast
          />

          {/* <ProfileMenuItem
            title="Minhas notificações"
            description="Acompanhe suas notificações"
            onPress={() => {}}
            icon={<Bell />}
          />

          <ProfileMenuItem
            title="Meus compromissos"
            description="Compromissos e pendências"
            onPress={() => {}}
            icon={<ClipboardList />}
          />

          <ProfileMenuItem
            title="Política de Privacidade"
            description="Veja nossa política de privacidade"
            onPress={() => {}}
            icon={<Lock />}
          />

          <ProfileMenuItem
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
                variant: "danger",
              },
            ]}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
