import { createNavigationContainerRef } from "@react-navigation/native";
import { RootStackParamList } from "./types";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/** Foca uma aba do BottomTabs (aninhado na rota "Home"). */
export function navigateToTab(tab: string) {
  if (!navigationRef.isReady()) return;
  (navigationRef.navigate as any)("Home", { screen: tab });
}

/** Navega para uma rota de stack de primeiro nível (ex.: "Videos"). */
export function navigateToScreen(screen: keyof RootStackParamList) {
  if (!navigationRef.isReady()) return;
  navigationRef.navigate(screen as never);
}
