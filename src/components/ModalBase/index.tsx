import { useAppTheme } from "@/context/ThemeContext";
import { X } from "lucide-react-native";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { toastConfig } from "../Toast/toastConfig";
import { useStyles } from "./styles";

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
  const { colors } = useAppTheme();
  const styles = useStyles();

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent
      presentationStyle="overFullScreen"
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.sheet}>
            {title && (
              <View style={styles.header}>
                <View style={styles.handle} />
                <View style={styles.headerRow}>
                  <Text style={styles.headerTitle}>{title}</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                    hitSlop={8}
                  >
                    <X size={16} color={colors.textMuted} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {children}
            <Toast config={toastConfig} />
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    </Modal>
  );
};
