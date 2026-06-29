jest.mock("@/navigation/navigationRef", () => ({
  navigateToTab: jest.fn(),
  navigateToScreen: jest.fn(),
}));

import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { CoachProvider, useCoach, COACH_STEPS } from "@/context/CoachContext";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CoachProvider>{children}</CoachProvider>
);

// Registra todos os alvos com medição instantânea (width > 0)
function registerAll(result: any) {
  COACH_STEPS.forEach((step) => {
    result.current.register(step.id, (cb: any) =>
      cb({ x: 0, y: 100, width: 200, height: 60 }),
    );
  });
}

describe("CoachContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });
  afterEach(() => jest.useRealTimers());

  it("começa inativo (active=false)", () => {
    const { result } = renderHook(() => useCoach(), { wrapper });
    expect(result.current.active).toBe(false);
    expect(result.current.step).toBeNull();
  });

  it("totalSteps bate com o número de steps definidos", () => {
    const { result } = renderHook(() => useCoach(), { wrapper });
    expect(result.current.totalSteps).toBe(COACH_STEPS.length);
  });

  it("start ativa o tour e posiciona no primeiro passo", async () => {
    const { result } = renderHook(() => useCoach(), { wrapper });
    registerAll(result);

    act(() => { result.current.start(); });
    act(() => { jest.runAllTimers(); });

    await waitFor(() => expect(result.current.active).toBe(true));
    await waitFor(() => expect(result.current.stepIndex).toBe(0));
  });

  it("step retorna o passo atual quando ativo", async () => {
    const { result } = renderHook(() => useCoach(), { wrapper });
    registerAll(result);

    act(() => { result.current.start(); });
    act(() => { jest.runAllTimers(); });

    await waitFor(() => expect(result.current.step?.id).toBe(COACH_STEPS[0].id));
  });

  it("stop desativa o tour", async () => {
    const { result } = renderHook(() => useCoach(), { wrapper });
    registerAll(result);

    act(() => { result.current.start(); });
    act(() => { jest.runAllTimers(); });
    await waitFor(() => expect(result.current.active).toBe(true));

    act(() => { result.current.stop(); });
    expect(result.current.active).toBe(false);
    expect(result.current.step).toBeNull();
  });

  it("next avança para o próximo passo", async () => {
    const { result } = renderHook(() => useCoach(), { wrapper });
    registerAll(result);

    act(() => { result.current.start(); });
    act(() => { jest.runAllTimers(); });
    await waitFor(() => expect(result.current.stepIndex).toBe(0));

    act(() => { result.current.next(); });
    act(() => { jest.runAllTimers(); });
    await waitFor(() => expect(result.current.stepIndex).toBe(1));
  });

  it("prev retrocede para o passo anterior", async () => {
    const { result } = renderHook(() => useCoach(), { wrapper });
    registerAll(result);

    act(() => { result.current.start(); });
    act(() => { jest.runAllTimers(); });
    await waitFor(() => expect(result.current.stepIndex).toBe(0));

    act(() => { result.current.next(); });
    act(() => { jest.runAllTimers(); });
    await waitFor(() => expect(result.current.stepIndex).toBe(1));

    act(() => { result.current.prev(); });
    act(() => { jest.runAllTimers(); });
    await waitFor(() => expect(result.current.stepIndex).toBe(0));
  });

  it("prev não faz nada quando está no primeiro passo", async () => {
    const { result } = renderHook(() => useCoach(), { wrapper });
    registerAll(result);

    act(() => { result.current.start(); });
    act(() => { jest.runAllTimers(); });
    await waitFor(() => expect(result.current.stepIndex).toBe(0));

    act(() => { result.current.prev(); });
    act(() => { jest.runAllTimers(); });
    // Continua no passo 0
    await waitFor(() => expect(result.current.stepIndex).toBe(0));
  });

  it("register e unregister funcionam sem lançar erro", () => {
    const { result } = renderHook(() => useCoach(), { wrapper });
    expect(() => {
      result.current.register("test-id", (cb: any) => cb({ x: 0, y: 0, width: 100, height: 50 }));
      result.current.unregister("test-id");
    }).not.toThrow();
  });

  it("registerAction e unregisterAction funcionam sem lançar erro", () => {
    const { result } = renderHook(() => useCoach(), { wrapper });
    expect(() => {
      result.current.registerAction("test-id", jest.fn());
      result.current.unregisterAction("test-id");
    }).not.toThrow();
  });

  it("desativa o tour ao chamar stop após inicio", async () => {
    const { result } = renderHook(() => useCoach(), { wrapper });
    registerAll(result);

    act(() => { result.current.start(); });
    act(() => { jest.runAllTimers(); });
    await waitFor(() => expect(result.current.active).toBe(true));

    act(() => { result.current.stop(); });
    expect(result.current.active).toBe(false);
    expect(result.current.targetRect).toBeNull();
  });
});
