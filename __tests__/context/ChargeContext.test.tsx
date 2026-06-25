const mockConsultCharge = jest.fn();
const mockReloadMemberData = jest.fn();

let capturedHandler: (msg: any) => Promise<void> | void = () => {};

const mockOnMessage = jest.fn((cb: any) => {
  capturedHandler = cb;
  return jest.fn();
});
const mockOnNotificationOpenedApp = jest.fn(() => jest.fn());
const mockGetInitialNotification = jest.fn(() => Promise.resolve(null));

jest.mock("@react-native-firebase/messaging", () => () => ({
  onMessage: mockOnMessage,
  onNotificationOpenedApp: mockOnNotificationOpenedApp,
  getInitialNotification: mockGetInitialNotification,
}));

jest.mock("@/services/ChargeService", () => ({
  ChargeServices: {
    consultCharge: (...args: any[]) => mockConsultCharge(...args),
    createCharge: jest.fn(),
  },
}));

jest.mock("@/context/AuthContext", () => {
  const React = require("react");
  return {
    AuthContext: React.createContext({
      reloadMemberData: (...args: any[]) => mockReloadMemberData(...args),
    }),
  };
});

import React, { useContext } from "react";
import { Text } from "react-native";
import { render, act, waitFor } from "@testing-library/react-native";
import { ChargeProvider, ChargeContext } from "@/context/ChargeContext";

function Consumer() {
  const { charge } = useContext(ChargeContext);
  return <Text>{`status:${charge.status ?? "none"}`}</Text>;
}

function renderProvider() {
  return render(
    <ChargeProvider>
      <Consumer />
    </ChargeProvider>,
  );
}

describe("ChargeContext - push PAYMENT_CONFIRMED", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReloadMemberData.mockResolvedValue(undefined);
    capturedHandler = () => {};
  });

  it("consulta a cobrança e marca como aprovada quando o push do PIX traz transactionId", async () => {
    mockConsultCharge.mockResolvedValue({
      transactionId: "12345",
      status: "approved",
    });

    const { getByText } = renderProvider();
    expect(mockOnMessage).toHaveBeenCalled();

    await act(async () => {
      await capturedHandler({
        data: {
          type: "PAYMENT_CONFIRMED",
          paymentMethod: "pix",
          transactionId: "12345",
        },
      });
    });

    expect(mockConsultCharge).toHaveBeenCalledWith("12345");
    await waitFor(() => expect(getByText("status:approved")).toBeTruthy());
    expect(mockReloadMemberData).toHaveBeenCalled();
  });

  it("não consulta cobrança no pagamento em dinheiro (sem transactionId)", async () => {
    renderProvider();

    await act(async () => {
      await capturedHandler({
        data: { type: "PAYMENT_CONFIRMED", paymentMethod: "cash" },
      });
    });

    expect(mockConsultCharge).not.toHaveBeenCalled();
    expect(mockReloadMemberData).toHaveBeenCalled();
  });
});
