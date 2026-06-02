import Toast from "react-native-toast-message";
import { styles } from "./styles";
import { Modal, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton } from "../IconButton";
import { COLORS } from "@/theme";
import { X } from "lucide-react-native";

interface IModalBase {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const ModalBase: React.FC<IModalBase> = ({
  visible,
  title,
  onClose,
  children,
}) => {
  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent
      presentationStyle="overFullScreen"
    >
      <SafeAreaView style={styles.safeArea}>
        {title && (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>

            <IconButton color={COLORS.white} icon={X} onPress={onClose} />
          </View>
        )}
        {children}
        <Toast />
      </SafeAreaView>
    </Modal>
  );
};
