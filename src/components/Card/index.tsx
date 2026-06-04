import { Text, View } from "react-native";
import { styles } from "./styles";

export const Card = ({ title, description, children }: any) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {!!description && (
        <Text style={styles.cardDescription}>{description}</Text>
      )}
      {children}
    </View>
  );
};
