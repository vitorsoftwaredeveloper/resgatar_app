export const THEME = {
  COLORS: {
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
    skeletonBg: "#E6E0D8",
    success: "#1E7F43",
    info: "#3B6DF6",
    successBackground: "#E6F4EA",
  },
  SPACING: {
    xs: 6,
    xxs: 8,
    sm: 10,
    sm2: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },

  RADIUS: {
    sm: 10,
    md: 16,
    lg: 22,
    xl: 28,
  },

  TYPOGRAPHY: {
    hero: 28,
    title: 20,
    large: 18,
    subtitle: 16,
    body: 14,
    small: 12,
    xsmall: 11,
  },

  SHADOW: {
    card: {
      shadowColor: "#000000",
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 3,
    },
  },
};

const { COLORS, RADIUS, SPACING, TYPOGRAPHY, SHADOW } = THEME;
export { COLORS, RADIUS, SHADOW, SPACING, TYPOGRAPHY };
