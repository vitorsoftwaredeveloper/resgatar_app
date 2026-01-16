import Toast from "react-native-toast-message";
import { styles } from "./styles";
import { Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface IModalBase {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const ModalBase: React.FC<IModalBase> = ({
  visible,
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
        {children}
        <Toast />
      </SafeAreaView>
    </Modal>
  );
};
