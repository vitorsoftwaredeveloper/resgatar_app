import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { navigateToScreen, navigateToTab } from "@/navigation/navigationRef";
import { AuthContext } from "@/context/AuthContext";

export interface CoachRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

type MeasureCallback = (cb: (rect: CoachRect) => void) => void;

export interface CoachStep {
  id: string; // deve bater com o id usado no CoachTarget
  title: string;
  text: string;
  /** Aba do BottomTabs a focar antes de medir (ex.: "Dashboard", "Bills", "Profile"). */
  tab?: string;
  /** Rota de stack de 1º nível a abrir antes de medir (ex.: "Videos"). */
  screen?: "Videos";
  /** Se o alvo não estiver na tela (ex.: botão condicional), o passo é pulado. */
  optional?: boolean;
  /** Callback executado ao entrar no passo (ex.: abrir um dropdown). */
  onEnter?: () => void;
}

// Ordem do tour guiado entre as telas.
export const COACH_STEPS: CoachStep[] = [
  {
    id: "tab-dashboard",
    title: "Início",
    text: "Aqui você acompanha a meta da comunidade, sua caminhada de leituras e os avisos.",
    tab: "Dashboard",
  },
  {
    id: "tab-readings",
    title: "Leituras",
    text: "Esta é a sua aba de leituras: a liturgia do dia com primeira leitura, salmo e evangelho.",
    tab: "Readings",
  },
  {
    id: "dashboard-date",
    title: "Escolha o dia",
    text: "Toque na data para abrir o calendário e ver a liturgia de qualquer dia.",
    tab: "Readings",
  },
  {
    id: "tab-bills",
    title: "Contribuições",
    text: "Veja seu histórico mensal e pague a contribuição via PIX.",
    tab: "Bills",
  },
  {
    id: "tab-profile",
    title: "Mais",
    text: "Aqui você gerencia sua conta e acessa os vídeos da comunidade.",
    tab: "Profile",
  },
  {
    id: "profile-photo",
    title: "Foto de perfil",
    text: "Toque na sua foto para trocá-la pela câmera ou galeria.",
    tab: "Profile",
  },
  {
    id: "profile-edit",
    title: "Meus dados",
    text: "Visualize e edite seus dados pessoais quando precisar.",
    tab: "Profile",
  },
  {
    id: "profile-password",
    title: "Atualizar senha",
    text: "Altere a senha de acesso ao aplicativo por aqui.",
    tab: "Profile",
  },
  {
    id: "profile-videos",
    title: "Vídeos da comunidade",
    text: "Toque aqui para assistir e compartilhar vídeos com os membros.",
    tab: "Profile",
  },
  {
    id: "header-quickactions",
    title: "Ações rápidas",
    text: "Toque neste botão para acessar atalhos úteis do aplicativo.",
    tab: "Dashboard",
  },
];

interface CoachContextData {
  active: boolean;
  stepIndex: number;
  step: CoachStep | null;
  targetRect: CoachRect | null;
  totalSteps: number;
  register: (id: string, measure: MeasureCallback) => void;
  unregister: (id: string) => void;
  registerAction: (id: string, fn: () => void) => void;
  unregisterAction: (id: string) => void;
  start: () => void;
  next: () => void;
  prev: () => void;
  stop: () => void;
}

const CoachContext = createContext<CoachContextData>({} as CoachContextData);

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function CoachProvider({ children }: { children: React.ReactNode }) {
  const registry = useRef<Map<string, MeasureCallback>>(new Map());
  const actionRegistry = useRef<Map<string, () => void>>(new Map());

  const registerAction = useCallback((id: string, fn: () => void) => {
    actionRegistry.current.set(id, fn);
  }, []);

  const unregisterAction = useCallback((id: string) => {
    actionRegistry.current.delete(id);
  }, []);

  const { completeTutorial } = useContext(AuthContext);

  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<CoachRect | null>(null);

  const register = useCallback((id: string, measure: MeasureCallback) => {
    registry.current.set(id, measure);
  }, []);

  const unregister = useCallback((id: string) => {
    registry.current.delete(id);
  }, []);

  // Mede um alvo registrado, com algumas tentativas até a tela montar/layoutar.
  const measureWithRetry = useCallback(
    async (id: string, attempts = 10): Promise<CoachRect | null> => {
      for (let i = 0; i < attempts; i++) {
        const measure = registry.current.get(id);
        if (measure) {
          const rect = await new Promise<CoachRect>((resolve) =>
            measure(resolve),
          );
          if (rect && rect.width > 0 && rect.height > 0) return rect;
        }
        await wait(90);
      }
      return null;
    },
    [],
  );

  const goToStep = useCallback(
    async (index: number, direction: 1 | -1 = 1) => {
      if (index < 0 || index >= COACH_STEPS.length) {
        setActive(false);
        setTargetRect(null);
        // Avançar além do último passo = tutorial concluído (≠ pular via stop).
        if (index >= COACH_STEPS.length) completeTutorial();
        return;
      }

      const step = COACH_STEPS[index];

      // esconde o balão enquanto troca de tela
      setTargetRect(null);

      if (step.screen) {
        navigateToScreen(step.screen);
        await wait(350);
      } else if (step.tab) {
        navigateToTab(step.tab);
        await wait(300);
      }

      const action = actionRegistry.current.get(step.id);
      if (action) {
        action();
        await wait(250);
      }

      const rect = await measureWithRetry(step.id, step.optional ? 5 : 10);

      // Passo opcional sem alvo na tela (ex.: botão Pagar sem pendência): pula.
      if (!rect && step.optional) {
        goToStep(index + direction, direction);
        return;
      }

      setStepIndex(index);
      setTargetRect(rect);
    },
    [measureWithRetry, completeTutorial],
  );

  const start = useCallback(() => {
    setActive(true);
    setStepIndex(0);
    goToStep(0, 1);
  }, [goToStep]);

  const next = useCallback(() => {
    goToStep(stepIndex + 1, 1);
  }, [stepIndex, goToStep]);

  const prev = useCallback(() => {
    if (stepIndex === 0) return;
    goToStep(stepIndex - 1, -1);
  }, [stepIndex, goToStep]);

  const stop = useCallback(() => {
    setActive(false);
    setTargetRect(null);
  }, []);

  return (
    <CoachContext.Provider
      value={{
        active,
        stepIndex,
        step: active ? (COACH_STEPS[stepIndex] ?? null) : null,
        targetRect,
        totalSteps: COACH_STEPS.length,
        register,
        unregister,
        registerAction,
        unregisterAction,
        start,
        next,
        prev,
        stop,
      }}
    >
      {children}
    </CoachContext.Provider>
  );
}

export function useCoach() {
  return useContext(CoachContext);
}
