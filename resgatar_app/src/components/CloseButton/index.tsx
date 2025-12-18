import { X } from "lucide-react-native";
import { styles } from "./styles";
import { TouchableOpacity } from "react-native";

interface ICloseButton {
  onPress: () => void;
  size?: number;
}
export const CloseButton = ({ onPress, size = 22 }: ICloseButton) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.closeButton}>
      <X size={size} color="#FFF" />
    </TouchableOpacity>
  );
};
