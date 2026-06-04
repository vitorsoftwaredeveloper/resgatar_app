import { styles } from "./styles";
import { TouchableOpacity } from "react-native";

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
