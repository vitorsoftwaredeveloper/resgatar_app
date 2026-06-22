jest.mock("react-native-toast-message", () => {
  const React = require("react");
  return {
    BaseToast: (props: any) => React.createElement("BaseToast", props),
  };
});

import { render } from "@testing-library/react-native";
import { toastConfig } from "@/components/Toast/toastConfig";

function renderType(type: "success" | "error" | "warning" | "info") {
  const element = toastConfig[type]!({ text1: "Título" } as any);
  return render(element as any).UNSAFE_getByType("BaseToast" as any);
}

describe("toastConfig", () => {
  it("define os 4 tipos (success, error, warning, info)", () => {
    expect(typeof toastConfig.success).toBe("function");
    expect(typeof toastConfig.error).toBe("function");
    expect(typeof toastConfig.warning).toBe("function");
    expect(typeof toastConfig.info).toBe("function");
  });

  it("permite múltiplas linhas (numberOfLines = 0)", () => {
    const toast = renderType("error");
    expect(toast.props.text1NumberOfLines).toBe(0);
    expect(toast.props.text2NumberOfLines).toBe(0);
  });

  it("usa altura automática (não fixa)", () => {
    const toast = renderType("success");
    expect(toast.props.style.height).toBe("auto");
    expect(toast.props.style.minHeight).toBe(60);
  });

  it("repassa os props recebidos (text1)", () => {
    const toast = renderType("info");
    expect(toast.props.text1).toBe("Título");
  });

  it.each([
    ["success", "#69C779"],
    ["error", "#FE6301"],
    ["warning", "#FFC107"],
    ["info", "#87CEFA"],
  ] as const)("aplica a borda colorida do tipo %s", (type, color) => {
    const toast = renderType(type);
    expect(toast.props.style.borderLeftColor).toBe(color);
  });
});
