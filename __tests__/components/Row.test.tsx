import React from "react";
import { render } from "@testing-library/react-native";
import { Row } from "@/components/Row";

describe("Row", () => {
  it("renderiza sem erros", () => {
    expect(() => render(<Row />)).not.toThrow();
  });

  it("renderiza children", () => {
    const { getByText } = render(
      <Row>
        {React.createElement("Text" as any, null, "filho 1")}
        {React.createElement("Text" as any, null, "filho 2")}
      </Row>,
    );
    expect(getByText("filho 1")).toBeTruthy();
    expect(getByText("filho 2")).toBeTruthy();
  });
});
