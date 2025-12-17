import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { User, Lock, LogOut, ChevronRight } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "../../components/Button";
import { ModalEditProfile } from "./ModalEditProfile";
import { ModalUpdatePassword } from "./ModalUpdatePassword";

export const ProfileScreen = () => {
  const { logout } = useContext(AuthContext);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.title}>Perfil</Text>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => setEditModalVisible(true)}
          >
            <View style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <User size={20} />
                <Text style={styles.optionText}>Editar Perfil</Text>
              </View>
              <ChevronRight size={20} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => setPasswordModalVisible(true)}
          >
            <View style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Lock size={20} />
                <Text style={styles.optionText}>Alterar Senha</Text>
              </View>
              <ChevronRight size={20} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Card de opções */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.option} onPress={logout}>
            <View style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <LogOut size={20} color="#D32F2F" />
                <Text style={[styles.optionText, styles.logoutText]}>Sair</Text>
              </View>
              <ChevronRight size={20} color="#D32F2F" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Modais */}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 32,
  },
  card: {
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#F5F5F5",
  },
  option: {
    paddingVertical: 16,
  },
  optionText: {
    fontSize: 16,
  },
  logoutText: {
    color: "#D32F2F",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
