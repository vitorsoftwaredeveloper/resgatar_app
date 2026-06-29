const mockRegister = jest.fn();
const mockUnregister = jest.fn();

jest.mock("@/context/CoachContext", () => ({
  useCoach: () => ({ register: mockRegister, unregister: mockUnregister }),
}));

import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";
import { CoachTarget } from "@/components/CoachTarget";

describe("CoachTarget", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renderiza os filhos", () => {
    const { getByText } = render(
      <CoachTarget id="test-id"><Text>filho</Text></CoachTarget>,
    );
    expect(getByText("filho")).toBeTruthy();
  });

  it("registra o id ao montar", () => {
    render(<CoachTarget id="meu-alvo"><Text>x</Text></CoachTarget>);
    expect(mockRegister).toHaveBeenCalledWith("meu-alvo", expect.any(Function));
  });

  it("desregistra o id ao desmontar", () => {
    const { unmount } = render(
      <CoachTarget id="meu-alvo"><Text>x</Text></CoachTarget>,
    );
    unmount();
    expect(mockUnregister).toHaveBeenCalledWith("meu-alvo");
  });

  it("re-registra quando o id muda", () => {
    const { rerender } = render(
      <CoachTarget id="id-a"><Text>x</Text></CoachTarget>,
    );
    rerender(<CoachTarget id="id-b"><Text>x</Text></CoachTarget>);
    expect(mockRegister).toHaveBeenCalledWith("id-b", expect.any(Function));
  });
});
