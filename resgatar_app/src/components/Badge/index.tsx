import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { Text } from "react-native";
import { styles } from "./styles";

export function Badge({ value }: { value: number }) {
  if (value <= 0) return null;

  return (
    <Animated.View
      entering={ZoomIn.duration(200)}
      exiting={ZoomOut.duration(150)}
      style={styles.animated}
    >
      <Text style={styles.text}>{value}</Text>
    </Animated.View>
  );
}
