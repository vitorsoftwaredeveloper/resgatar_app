import { View, Dimensions, Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Home, FileText, User } from "lucide-react-native";
import { Badge } from "../Badge";
import { styles, TAB_WIDTH, ACTIVE_COLOR, INACTIVE_COLOR } from "./styles";

export function TabBar({ state, navigation }: any) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(state.index * TAB_WIDTH, {
          duration: 250,
        }),
      },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.indicator, animatedStyle]} />

      <View style={styles.row}>
        {state.routes.map((route: any, index: number) => {
          const focused = state.index === index;

          const iconColor = focused ? ACTIVE_COLOR : INACTIVE_COLOR;

          const icons: any = {
            Dashboard: <Home size={24} color={iconColor} />,
            Bills: <FileText size={24} color={iconColor} />,
            Profile: <User size={24} color={iconColor} />,
          };

          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={styles.tab}
            >
              <View>
                {icons[route.name]}
                {route.name === "Bills" && <Badge value={3} />}
              </View>

              <Text style={[styles.label, { color: iconColor }]}>
                {route.name === "Dashboard"
                  ? "Início"
                  : route.name === "Bills"
                  ? "Faturas"
                  : "Perfil"}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
