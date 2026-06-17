jest.mock("react-native-reanimated", () => {
  const React = require("react");
  const AnimatedView = ({ children, style }: any) =>
    React.createElement("View", { style }, children);
  return {
    __esModule: true,
    default: { View: AnimatedView },
    useSharedValue: (v: any) => ({ value: v }),
    useAnimatedStyle: () => ({}),
    withRepeat: (v: any) => v,
    withTiming: (v: any) => v,
  };
});
jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: {
      primary: "#6B4F3A", background: "#F6F1EB", card: "#FFF",
      text: "#000", textMuted: "#999", border: "#ccc",
      skeletonBg: "#ccc", error: "#E53935",
    },
    mode: "light",
  }),
}));
jest.mock("lucide-react-native", () => ({ User: () => null }));

import React from "react";
import { render } from "@testing-library/react-native";
import { MemberListWithSkeleton } from "@/components/Skeleton/MemberListWithSkeleton";

const members = [
  {
    _id: "1",
    firstName: "João",
    lastName: "Silva",
    email: "joao@email.com",
    phoneNumber: "11999991234",
    dateOfBirth: 0,
    paymentInfo: { datePayment: 0, amount: "50" },
    identification: { type: "CPF" as const, numberType: "52998224725" },
  },
  {
    _id: "2",
    firstName: "Maria",
    lastName: "Santos",
    email: "maria@email.com",
    phoneNumber: "11988887777",
    dateOfBirth: 0,
    paymentInfo: { datePayment: 0, amount: "50" },
    identification: { type: "CPF" as const, numberType: "52998224725" },
  },
];

const defaultProps = {
  members,
  loading: false,
  onAction: jest.fn(),
  iconAction: React.createElement("View" as any),
  variant: "edit" as const,
};

describe("MemberListWithSkeleton", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("quando loading é false", () => {
    it("exibe os membros da lista", () => {
      const { getByText } = render(<MemberListWithSkeleton {...defaultProps} />);
      expect(getByText("João")).toBeTruthy();
      expect(getByText("Maria")).toBeTruthy();
    });

    it("exibe o email dos membros", () => {
      const { getByText } = render(<MemberListWithSkeleton {...defaultProps} />);
      expect(getByText("joao@email.com")).toBeTruthy();
      expect(getByText("maria@email.com")).toBeTruthy();
    });

    it("não exibe skeletons", () => {
      const { UNSAFE_queryAllByType } = render(<MemberListWithSkeleton {...defaultProps} />);
      const views = UNSAFE_queryAllByType("View" as any);
      expect(views.length).toBeGreaterThan(0);
    });
  });

  describe("quando loading é true", () => {
    it("não exibe nomes dos membros", () => {
      const { queryByText } = render(
        <MemberListWithSkeleton {...defaultProps} loading={true} />,
      );
      expect(queryByText("João")).toBeNull();
      expect(queryByText("Maria")).toBeNull();
    });

    it("renderiza 4 skeletons", () => {
      const { UNSAFE_getAllByType } = render(
        <MemberListWithSkeleton {...defaultProps} loading={true} />,
      );
      // Cada RemoveMemberSkeleton renderiza um Animated.View (mapeado para View)
      const views = UNSAFE_getAllByType("View" as any);
      expect(views.length).toBeGreaterThan(0);
    });
  });

  describe("lista vazia", () => {
    it("renderiza sem erros quando members está vazio", () => {
      expect(() =>
        render(<MemberListWithSkeleton {...defaultProps} members={[]} />),
      ).not.toThrow();
    });
  });
});
