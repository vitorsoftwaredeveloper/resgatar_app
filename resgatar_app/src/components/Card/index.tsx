import { Text, View } from "react-native";
import { styles } from "./styles";

export const Card = ({ title, children }: any) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
};
