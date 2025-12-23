import { createContext, useContext, useState } from "react";

type LoadingContextType = {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
};

export const LoadingContext = createContext<LoadingContextType>(
  {} as LoadingContextType
);

export function LoadingProvider({ children }: any) {
  const [loading, setLoading] = useState(false);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ loading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);
