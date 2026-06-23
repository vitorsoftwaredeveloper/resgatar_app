import { View, Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Home,
  FileText,
  Settings,
  TextAlignJustify,
} from "lucide-react-native";
import { CoachTarget } from "@/components/CoachTarget";
import { useStyles, TAB_WIDTH, TAB_WIDTH_ADMIN } from "./styles";

export function TabBar({ state, navigation, isAdmin }: any) {
  const { bottom } = useSafeAreaInsets();
  const { styles, ACTIVE_COLOR, INACTIVE_COLOR } = useStyles();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(
          state.index * (isAdmin ? TAB_WIDTH_ADMIN : TAB_WIDTH),
          {
            duration: 250,
          },
        ),
      },
    ],
  }));

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      <Animated.View
        style={[
          styles.indicator,
          isAdmin && styles.indicatorAdmin,
          animatedStyle,
        ]}
      />

      <View style={styles.row}>
        {state.routes.map((route: any, index: number) => {
          const focused = state.index === index;

          const iconColor = focused ? ACTIVE_COLOR : INACTIVE_COLOR;

          const icons: any = {
            Dashboard: <Home size={24} color={iconColor} />,
            Bills: <FileText size={24} color={iconColor} />,
            Profile: <TextAlignJustify size={24} color={iconColor} />,
            ...(isAdmin && {
              Settings: <Settings size={24} color={iconColor} />,
            }),
          };

          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={isAdmin ? styles.tabAdmin : styles.tab}
            >
              <CoachTarget
                id={`tab-${route.name.toLowerCase()}`}
                style={styles.tabInner}
              >
                <View>{icons[route.name]}</View>

                <Text style={[styles.label, { color: iconColor }]}>
                  {route.name === "Dashboard"
                    ? "Início"
                    : route.name === "Bills"
                      ? "Contribuições"
                      : route.name === "Profile"
                        ? "Mais"
                        : "Ações"}
                </Text>
              </CoachTarget>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
