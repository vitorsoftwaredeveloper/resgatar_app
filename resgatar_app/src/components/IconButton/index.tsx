import { X } from "lucide-react-native";
import { styles } from "./styles";
import { TouchableOpacity } from "react-native";
import { COLORS } from "@/theme/colors";

interface IIconButton {
  onPress: () => void;
  size?: number;
  icon: any;
  color: string;
}

export const IconButton = ({
  onPress,
  size = 22,
  icon: Icon,
  color,
}: IIconButton) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.iconButton}>
      <Icon size={size} color={color} />
    </TouchableOpacity>
  );
};
