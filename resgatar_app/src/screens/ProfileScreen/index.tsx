import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "../../components/Button";
import { styles } from "./styles";
import { ModalEditProfile } from "./ModalEditProfile";
import { ModalUpdatePassword } from "./ModalUpdatePassword";

export const ProfileScreen = () => {
  const { logout } = useContext(AuthContext);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <TouchableOpacity
        style={styles.option}
        onPress={() => setEditModalVisible(true)}
      >
        <Text style={styles.optionText}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => setPasswordModalVisible(true)}
      >
        <Text style={styles.optionText}>Alterar Senha</Text>
      </TouchableOpacity>

      <Button title="Sair" onPress={logout} />

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
  );
};
