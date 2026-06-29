import { Text, View, ViewStyle } from "react-native";
import { useStyles } from "./styles";

export const Card = ({ title, description, children, style }: { title?: string; description?: string; children?: React.ReactNode; style?: ViewStyle }) => {
  const styles = useStyles();

  return (
    <View style={[styles.card, style]}>
      <Text style={styles.cardTitle}>{title}</Text>
      {!!description && (
        <Text style={styles.cardDescription}>{description}</Text>
      )}
      {children}
    </View>
  );
};
