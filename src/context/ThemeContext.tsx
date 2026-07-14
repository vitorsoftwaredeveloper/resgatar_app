import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "@resgatar:theme";

export type ThemeMode = "light" | "dark";

export type ThemeColors = {
  background: string;
  card: string;
  primary: string;
  text: string;
  textStrong: string;
  textMuted: string;
  muted: string;
  mutedBackground: string;
  border: string;
  inputBg: string;
  black: string;
  white: string;
  error: string;
  waiting: string;
  gold: string;
  softBrown: string;
  skeletonBg: string;
  success: string;
  info: string;
  successBackground: string;
  tabBarBg: string;
};

// Paleta editorial "Missal" do resgatar-browser (light + dark). Cards em creme
// quente, acento sépia + dourado litúrgico. Ambos os modos têm cores de texto
// próprias, então a tipografia fica legível no claro e no escuro.
const LIGHT: ThemeColors = {
  background: "#F6F1EB",
  card: "#FCF9F1",
  primary: "#6B4F3A",
  text: "#2C2015",
  textStrong: "#2C2015",
  textMuted: "#6B5A49",
  muted: "#9C8C78",
  mutedBackground: "#ffffff40",
  border: "#E4D9C6",
  inputBg: "#F6F0E3",
  black: "#000000",
  white: "#FFFFFF",
  error: "#A5462F",
  waiting: "#9C7A35",
  gold: "#A8761F",
  softBrown: "#EDE6DE",
  skeletonBg: "#c0bcb6",
  success: "#3D7A57",
  info: "#3B6DF6",
  successBackground: "#E2EEE3",
  tabBarBg: "rgba(252, 249, 241, 0.9)",
};

const DARK: ThemeColors = {
  background: "#1A1812",
  card: "#1F1810",
  primary: "#C9A055",
  text: "#F1E7D5",
  textStrong: "#F1E7D5",
  textMuted: "#C1AF98",
  muted: "#897862",
  mutedBackground: "rgba(30,28,18,0.5)",
  border: "#352A1C",
  inputBg: "#271E13",
  black: "#000000",
  white: "#FFFFFF",
  error: "#DF8468",
  waiting: "#C7A052",
  gold: "#D7A957",
  softBrown: "#2E2A1C",
  skeletonBg: "#4b452d",
  success: "#6FB089",
  info: "#3B6DF6",
  successBackground: "#1E2A20",
  tabBarBg: "rgba(31, 24, 16, 0.92)",
};

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  mode: "light",
  colors: LIGHT,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === "dark" || saved === "light") setMode(saved);
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      AsyncStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const colors = useMemo(() => (mode === "dark" ? DARK : LIGHT), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
