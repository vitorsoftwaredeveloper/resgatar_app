// Tokens estáticos (independentes de modo claro/escuro). As cores vivem no
// ThemeContext, que expõe a paleta do modo ativo via useAppTheme().
const THEME = {
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

const { RADIUS, SPACING, TYPOGRAPHY, SHADOW } = THEME;
export { RADIUS, SHADOW, SPACING, TYPOGRAPHY };
