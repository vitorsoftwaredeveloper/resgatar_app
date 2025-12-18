import { Text, Pressable } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { styles } from "./styles";
import { COLORS } from "@/theme/colors";

export function CustomTabBarItem({
  label,
  icon,
  focused,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  focused: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      {focused && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={styles.animation}
        />
      )}
      {icon}
      <Text
        style={[
          styles.text,
          { color: focused ? COLORS.primary : COLORS.muted },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
