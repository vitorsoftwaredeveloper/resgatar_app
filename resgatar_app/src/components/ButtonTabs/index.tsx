import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DashboardScreen } from "../../screens/DashboardScreen";
import { BillsScreen } from "../../screens/BillsScreen";
import { ProfileScreen } from "../../screens/ProfileScreen";
import { SettingsScreen } from "../../screens/Settings";
import { TabBar } from "../TabBar";

const Tab = createBottomTabNavigator();

interface IButtonTabsProps {
  isAdmin: boolean;
}
export const BottomTabs = ({ isAdmin }: IButtonTabsProps) => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar isAdmin={isAdmin} {...props} />}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Bills" component={BillsScreen} />
      {isAdmin && <Tab.Screen name="Settings" component={SettingsScreen} />}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
