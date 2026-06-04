import { View } from "react-native";
import { styles } from "./styles";

export function Row({ children }: any) {
  return <View style={styles.row}>{children}</View>;
}
