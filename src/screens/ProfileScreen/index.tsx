import { Dialog } from "@/components/Dialog";
import { Header } from "@/components/Header";
import { CoachTarget } from "@/components/CoachTarget";
import { ItemActionList } from "@/components/ItemActionList";
import { ProfileHeaderCard } from "@/components/ProfileHeaderCard";
import { SwipeableTab } from "@/components/SwipeableTab";
import { useAppTheme } from "@/context/ThemeContext";
import { IMember } from "@/types/Member";
import { RootStackParamList } from "@/navigation/types";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  HelpCircle,
  LogOut,
  Settings,
  ShieldUser,
  Video,
} from "lucide-react-native";
import React, { useContext, useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { ModalEditPhoto } from "./ModalEditPhoto";
import { useStyles } from "./styles";

export const ProfileScreen = () => {
  const { logout, member, restartOnboarding } = useContext(AuthContext);
  const { colors } = useAppTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const styles = useStyles();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [dialogLogoutVisible, setDialogLogoutVisible] = useState(false);

  const handleLgout = async () => {
    await logout();
    setDialogLogoutVisible(false);
  };

  return (
    <SwipeableTab>
      <View style={styles.container}>
        <Header
          name={member?.firstName + " " + member?.lastName}
          photo={member?.profileImage}
        />

        <View style={[styles.content, { paddingBottom: tabBarHeight }]}>
          <ProfileHeaderCard
            member={member as IMember}
            onPressAvatar={() => setPhotoModalVisible(true)}
          />

          <View style={styles.menuCard}>
            {member?.role === "admin" && (
              <ItemActionList
                title="Administrativo"
                description="Financeiro, membros e notificações da comunidade"
                onPress={() => navigation.navigate("Settings")}
                icon={<ShieldUser color={colors.primary} />}
              />
            )}

            <CoachTarget id="profile-personal-settings">
              <ItemActionList
                title="Configurações pessoais"
                description="Dados, senha e encerramento de conta"
                onPress={() => navigation.navigate("PersonalSettings")}
                icon={<Settings color={colors.primary} />}
              />
            </CoachTarget>

            <CoachTarget id="profile-videos">
              <ItemActionList
                title="Vídeos"
                description="Veja os vídeos publicados pelos membros"
                onPress={() => navigation.navigate("Videos")}
                icon={<Video color={colors.primary} />}
              />
            </CoachTarget>

            <ItemActionList
              title="Rever tutorial"
              description="Veja novamente a apresentação do aplicativo"
              onPress={restartOnboarding}
              icon={<HelpCircle color={colors.primary} />}
              isLast
            />
          </View>

          <TouchableOpacity
            style={styles.logout}
            onPress={() => setDialogLogoutVisible(true)}
          >
            <LogOut color={colors.error} />
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>

          {photoModalVisible && (
            <ModalEditPhoto
              visible={photoModalVisible}
              onClose={() => setPhotoModalVisible(false)}
            />
          )}

          {dialogLogoutVisible && (
            <Dialog
              visible={dialogLogoutVisible}
              title="Tem certeza que deseja sair?"
              description="Você pode realizar o login novamente e ter acesso a todas as funcionalidades do nosso aplicativo."
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
      </View>
    </SwipeableTab>
  );
};
