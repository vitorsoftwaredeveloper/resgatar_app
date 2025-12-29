import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  User,
  Lock,
  LogOut,
  ChevronRight,
  Bell,
  ClipboardList,
  Church,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../context/AuthContext";
import { ModalEditProfile } from "./ModalEditProfile";
import { ModalUpdatePassword } from "./ModalUpdatePassword";
import { ProfileMenuItem } from "@/components/ProfileMenuItem";
import { ProfileHeaderCard } from "@/components/ProfileHeaderCard";
import { styles } from "./styles";
import { DashboardHeader } from "@/components/DashboardHeader";

export const ProfileScreen = () => {
  const { logout, member } = useContext(AuthContext);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

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
          />
        </View>

        <TouchableOpacity style={styles.logout} onPress={logout}>
          <Text style={styles.logoutText}>⎋ Sair</Text>
        </TouchableOpacity>

        {editModalVisible && (
          <ModalEditProfile
            editModalVisible={editModalVisible}
            setEditModalVisible={setEditModalVisible}
          />
        )}

        {passwordModalVisible && (
          <ModalUpdatePassword
            passwordModalVisible={passwordModalVisible}
            setPasswordModalVisible={setPasswordModalVisible}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
