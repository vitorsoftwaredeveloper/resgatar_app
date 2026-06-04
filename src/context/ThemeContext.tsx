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
  softBrown: string;
  skeletonBg: string;
  success: string;
  info: string;
  successBackground: string;
  tabBarBg: string;
  headerGlass: string;
};

const LIGHT: ThemeColors = {
  background: "#F6F1EB",
  card: "#FFFFFF",
  primary: "#6B4F3A",
  text: "#3E2F23",
  textStrong: "#3E2C1C",
  textMuted: "#8C7A6B",
  muted: "#9E8E80",
  mutedBackground: "#ffffff40",
  border: "#DED6CC",
  inputBg: "#FBF8F4",
  black: "#000000",
  white: "#FFFFFF",
  error: "#E53935",
  waiting: "#E0B96A",
  softBrown: "#EDE6DE",
  skeletonBg: "#c0bcb6",
  success: "#1E7F43",
  info: "#3B6DF6",
  successBackground: "#E6F4EA",
  tabBarBg: "rgba(255, 255, 255, 0.9)",
  headerGlass: "rgba(255, 255, 255, 0.8)",
};

const DARK: ThemeColors = {
  background: "#1A1812",
  card: "#252118",
  primary: "#C9A055",
  text: "#EDE0B8",
  textStrong: "#F5EDD5",
  textMuted: "#8A7D5A",
  muted: "#4A3F28",
  mutedBackground: "rgba(30,28,18,0.5)",
  border: "rgba(255,255,255,0.08)",
  inputBg: "#2C2820",
  black: "#000000",
  white: "#FFFFFF",
  error: "#E57373",
  waiting: "#C9902A",
  softBrown: "#2E2A1C",
  skeletonBg: "#4b452d",
  success: "#4CAF6B",
  info: "#3B6DF6",
  successBackground: "#182E20",
  tabBarBg: "rgba(26, 24, 18, 0.95)",
  headerGlass: "rgba(26, 24, 18, 0.88)",
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
