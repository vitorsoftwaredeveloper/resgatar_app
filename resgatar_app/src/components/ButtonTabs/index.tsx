import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, FileText, User } from "lucide-react-native";
import { DashboardScreen } from "../../screens/DashboardScreen";
import { BillsScreen } from "../../screens/BillsScreen";
import { ProfileScreen } from "../../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#67159C",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: "Início",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="Bills"
        component={BillsScreen}
        options={{
          tabBarLabel: "Faturas",
          tabBarIcon: ({ color, size }) => (
            <FileText color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
