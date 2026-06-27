import { View, Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BookOpen, FileText, Home, TextAlignJustify } from "lucide-react-native";
import { CoachTarget } from "@/components/CoachTarget";
import { useStyles, SCREEN_WIDTH } from "./styles";

const TAB_LABELS: Record<string, string> = {
  Dashboard: "Início",
  Readings: "Leituras",
  Bills: "Contribuições",
  Profile: "Mais",
};

export function TabBar({ state, navigation }: any) {
  const { bottom } = useSafeAreaInsets();
  const { styles, ACTIVE_COLOR, INACTIVE_COLOR } = useStyles();

  const tabWidth = SCREEN_WIDTH / state.routes.length;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(state.index * tabWidth, {
          duration: 250,
        }),
      },
    ],
  }));

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      <Animated.View
        style={[styles.indicator, { width: tabWidth }, animatedStyle]}
      />

      <View style={styles.row}>
        {state.routes.map((route: any, index: number) => {
          const focused = state.index === index;

          const iconColor = focused ? ACTIVE_COLOR : INACTIVE_COLOR;

          const icons: any = {
            Dashboard: <Home size={24} color={iconColor} />,
            Readings: <BookOpen size={24} color={iconColor} />,
            Bills: <FileText size={24} color={iconColor} />,
            Profile: <TextAlignJustify size={24} color={iconColor} />,
          };

          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={[styles.tab, { width: tabWidth }]}
            >
              <CoachTarget
                id={`tab-${route.name.toLowerCase()}`}
                style={styles.tabInner}
              >
                <View>{icons[route.name]}</View>

                <Text style={[styles.label, { color: iconColor }]}>
                  {TAB_LABELS[route.name]}
                </Text>
              </CoachTarget>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
