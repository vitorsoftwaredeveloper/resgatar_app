import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: [
    "<rootDir>/__tests__/**/*.test.ts",
    "<rootDir>/__tests__/**/*.test.tsx",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@env$": "<rootDir>/__tests__/__mocks__/env.ts",
    "^react-native$": "<rootDir>/__tests__/__mocks__/react-native.ts",
    "^react-native-reanimated$":
      "<rootDir>/__tests__/__mocks__/react-native-reanimated.tsx",
    "^react-native-svg$": "<rootDir>/__tests__/__mocks__/react-native-svg.tsx",
    "^expo-secure-store$": "<rootDir>/__tests__/__mocks__/expo-secure-store.ts",
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { strict: true, jsx: "react-jsx" } }],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|expo|@expo|@unimodules|unimodules|@react-native-firebase|@react-native-community)/)",
  ],
  silent: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    // sem lógica de negócio — ignorados
    "!src/types/**",
    "!src/theme/**",
    "!src/config/**",
    "!src/navigation/**",
    "!src/App.tsx",
    // estilos puros
    "!src/**/*.styles.{ts,tsx}",
    "!src/**/styles.{ts,tsx}",
    // SVG / ativos visuais
    "!src/components/Svg/**",
    // screens (integração, não unidade)
    "!src/screens/**",
    // contexts com dependência de Cognito
    "!src/context/AuthContext.tsx",
    "!src/context/ChargeContext.tsx",
    // services wrapper sem lógica própria
    "!src/services/api.ts",
    "!src/services/ChargeService.ts",
    "!src/services/MemberService.ts",
    "!src/services/NotificationService.ts",
    // componentes que dependem de gesture-handler/reanimated nativo
    "!src/components/SwipeableTab/**",
    "!src/components/TabBar/**",
    "!src/components/BottonTabs/**",
  ],
};

export default config;
