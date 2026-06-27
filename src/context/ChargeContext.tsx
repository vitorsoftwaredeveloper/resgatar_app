import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";
import {
  ICharge,
  PAYMENT_NOTIFICATION_TYPE,
  PAYMENT_CONFIRMED_NOTIFICATION_TYPE,
  TRANSACTION_STATUS,
} from "@/types/Charge";
import { ChargeServices } from "@/services/ChargeService";
import { AuthContext } from "@/context/AuthContext";

interface ChargeContextData {
  charge: ICharge;
  createCharge: (month: number) => Promise<void>;
}

export const ChargeContext = createContext<ChargeContextData>(
  {} as ChargeContextData,
);

export const ChargeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [charge, setCharge] = useState({} as ICharge);
  const { reloadMemberData } = useContext(AuthContext);

  // Mantém sempre a cobrança corrente acessível dentro dos listeners de push,
  // que são registrados uma única vez e não enxergam atualizações de estado.
  const chargeRef = useRef<ICharge>(charge);

  useEffect(() => {
    chargeRef.current = charge;
  }, [charge]);

  async function createCharge(month: number) {
    try {
      const charge = await ChargeServices.createCharge(month);

      setCharge(charge);
    } catch (error) {
      console.error("Error creating charge", error);
      throw error;
    }
  }

  async function consultCharge(transactionId?: string) {
    const id = transactionId ?? chargeRef.current.transactionId;

    if (!id) return;

    try {
      const chargeResult = await ChargeServices.consultCharge(id);
      setCharge(chargeResult);
    } catch (error) {
      console.error("Error consulting charge", error);
      throw error;
    }
  }

  // Em vez de consultar a cobrança em loop, reagimos ao push disparado pelo
  // backend quando o webhook do Mercado Pago atualiza o pagamento. O push é
  // apenas o gatilho: confirmamos o status real com uma única consulta.
  async function handlePaymentMessage(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
  ) {
    if (!remoteMessage) return;

    const data = remoteMessage.data;

    // Push de pagamento confirmado (cash ou PIX via notifyPaymentConfirmed).
    // Para PIX há uma cobrança ativa pendente (modal aberto): atualizamos o
    // status dela para `approved` para que o PixPaymentModal feche sozinho.
    // Para cash não há transactionId — apenas recarregamos os dados do membro.
    if (data?.type === PAYMENT_CONFIRMED_NOTIFICATION_TYPE) {
      const notifiedTransactionId = data?.transactionId as string | undefined;
      const active = chargeRef.current;
      const transactionId =
        notifiedTransactionId ??
        (active?.status === TRANSACTION_STATUS.PENDING
          ? active.transactionId
          : undefined);

      try {
        if (transactionId) await consultCharge(transactionId);
        await reloadMemberData();
      } catch (error) {
        console.error("Error reloading member after confirmed payment", error);
      }
      return;
    }

    // Se o push declara explicitamente um tipo diferente de pagamento, ignora.
    // Quando não há `type` (notificação genérica), seguimos adiante e deixamos
    // a presença de uma cobrança ativa decidir se vale consultar.
    if (data?.type && data.type !== PAYMENT_NOTIFICATION_TYPE) return;

    const notifiedTransactionId = data?.transactionId as string | undefined;
    const activeTransactionId = chargeRef.current?.transactionId;

    // Se há uma cobrança aberta e o push aponta para outra, ignora.
    if (
      activeTransactionId &&
      notifiedTransactionId &&
      notifiedTransactionId !== activeTransactionId
    ) {
      return;
    }

    // Prioriza o id vindo no push (cobre o caso de app reiniciado, em que a
    // cobrança em memória foi perdida); cai para a cobrança ativa.
    const transactionId = notifiedTransactionId ?? activeTransactionId;

    if (!transactionId) return;

    await consultCharge(transactionId);

    // Atualiza os dados do membro para refletir a contribuição na listagem,
    // mesmo quando o app foi aberto a partir do estado encerrado (sem o modal
    // de pagamento montado para disparar esse refresh).
    try {
      await reloadMemberData();
    } catch (error) {
      console.error("Error reloading member after payment update", error);
    }
  }

  useEffect(() => {
    // App em primeiro plano: o push chega como mensagem.
    const unsubscribeForeground = messaging().onMessage(handlePaymentMessage);

    // App em segundo plano: usuário toca na notificação e abre o app.
    const unsubscribeOpened =
      messaging().onNotificationOpenedApp(handlePaymentMessage);

    // App encerrado: aberto a partir do toque na notificação.
    messaging().getInitialNotification().then(handlePaymentMessage);

    return () => {
      unsubscribeForeground();
      unsubscribeOpened();
    };
  }, []);

  // Fallback para quando o push não chega (ex.: usuário sai para o app do banco
  // e volta pelo seletor de apps, sem tocar na notificação). Enquanto a cobrança
  // está pendente, reconsultamos o status ao voltar ao foreground e em um
  // polling leve. O push continua sendo o caminho feliz; isto é só a rede de
  // segurança.
  useEffect(() => {
    if (charge?.status !== TRANSACTION_STATUS.PENDING || !charge?.transactionId)
      return;

    async function refreshPending() {
      try {
        await consultCharge();
        await reloadMemberData();
      } catch (error) {
        console.error("Error refreshing pending charge", error);
      }
    }

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") refreshPending();
    });

    const interval = setInterval(refreshPending, 5000);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, [charge?.status, charge?.transactionId]);

  return (
    <ChargeContext.Provider value={{ charge, createCharge }}>
      {children}
    </ChargeContext.Provider>
  );
};
