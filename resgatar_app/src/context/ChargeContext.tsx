import React, { createContext, useState } from "react";
import { ICharge } from "@/types/Charge";
import { ChargeServices } from "@/services/ChargeService";

interface ChargeContextData {
  charge: ICharge;
  createCharge: (value: number) => Promise<void>;
  consultCharge: () => Promise<void>;
}

export const ChargeContext = createContext<ChargeContextData>(
  {} as ChargeContextData
);

export const ChargeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [charge, setCharge] = useState({} as ICharge);

  async function createCharge(value: number) {
    try {
      const charge = await ChargeServices.createCharge(value);

      setCharge(charge);
    } catch (error) {
      console.error("Error creating charge", error);
      throw error;
    }
  }

  async function consultCharge() {
    try {
      const chargeResult = await ChargeServices.consultCharge(
        charge.transactionId
      );
      setCharge(chargeResult);
    } catch (error) {
      console.error("Error consulting charge", error);
      throw error;
    }
  }

  return (
    <ChargeContext.Provider value={{ charge, createCharge, consultCharge }}>
      {children}
    </ChargeContext.Provider>
  );
};
