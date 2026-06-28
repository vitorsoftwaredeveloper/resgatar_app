import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ModalBase } from "@/components/ModalBase";
import { ToastMessage } from "@/components/Toast";
import { PixPaymentModal } from "@/screens/BillsScreen/PixPaymentModal";
import { DonationServices } from "@/services/DonationService";
import {
  PAYMENT_CONFIRMED_NOTIFICATION_TYPE,
  TRANSACTION_STATUS,
} from "@/types/Charge";
import { IDonation } from "@/types/Donation";
import {
  currencyToBackendBRL,
  maskCurrencyBRL,
  onlyNumbers,
} from "@/utils/mask";
import messaging from "@react-native-firebase/messaging";
import React, { useEffect, useState } from "react";
import {
  AppState,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useStyles } from "./styles";

// Valores rápidos de doação, em reais.
const QUICK_AMOUNTS = [10, 20, 50, 100];

interface Props {
  visible: boolean;
  onClose: () => void;
  isAdmin: boolean;
}

export function ModalDonate({ visible, onClose, isAdmin }: Props) {
  const styles = useStyles();

  const [amount, setAmount] = useState("10,00");
  const [donorName, setDonorName] = useState("");
  const [pixLoading, setPixLoading] = useState(false);
  const [cashLoading, setCashLoading] = useState(false);

  // Doação PIX criada: enquanto existe, mostramos o modal de QR.
  const [donation, setDonation] = useState<IDonation | null>(null);
  const [pixStatus, setPixStatus] = useState(TRANSACTION_STATUS.PENDING);

  const amountCents = Number(onlyNumbers(amount));

  function reset() {
    setAmount("");
    setDonorName("");
    setPixLoading(false);
    setCashLoading(false);
    setDonation(null);
    setPixStatus(TRANSACTION_STATUS.PENDING);
  }

  function handleClose() {
    reset();
    onClose();
  }


  // Confirmação do PIX chega por push (mesmo notifyPaymentConfirmed das charges).
  // Ao receber com o transactionId desta doação, marcamos como aprovado para o
  // PixPaymentModal fechar sozinho.
  useEffect(() => {
    if (!donation) return;
    const unsubscribe = messaging().onMessage((msg) => {
      const data = msg?.data;
      if (
        data?.type === PAYMENT_CONFIRMED_NOTIFICATION_TYPE &&
        data?.transactionId === donation.transactionId
      ) {
        setPixStatus(TRANSACTION_STATUS.APPROVED);
      }
    });
    return unsubscribe;
  }, [donation]);

  // Fallback para quando o push não chega (ex.: usuário sai para o app do banco
  // e volta sem tocar na notificação, então o onMessage foreground não dispara).
  // Enquanto a doação está pendente, consultamos o status real ao voltar ao
  // foreground e também em um polling leve.
  useEffect(() => {
    if (!donation || pixStatus === TRANSACTION_STATUS.APPROVED) return;

    let cancelled = false;

    async function checkStatus() {
      try {
        const current = await DonationServices.consult(donation!.transactionId);
        if (!cancelled && current.status === TRANSACTION_STATUS.APPROVED) {
          setPixStatus(TRANSACTION_STATUS.APPROVED);
        }
      } catch {
        // Silencioso: é apenas um fallback, o push continua sendo o caminho feliz.
      }
    }

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") checkStatus();
    });

    const interval = setInterval(checkStatus, 5000);

    return () => {
      cancelled = true;
      subscription.remove();
      clearInterval(interval);
    };
  }, [donation, pixStatus]);

  async function handlePix() {
    if (amountCents <= 0) {
      ToastMessage.error("Informe um valor para doar.");
      return;
    }
    setPixLoading(true);
    try {
      const created = await DonationServices.createPix(
        currencyToBackendBRL(amount),
        donorName.trim() || undefined,
      );
      setDonation(created);
      setPixStatus(created.status);
    } catch {
      ToastMessage.error("Erro ao gerar a doação PIX. Tente novamente.");
    } finally {
      setPixLoading(false);
    }
  }

  async function handleCash() {
    if (amountCents <= 0) {
      ToastMessage.error("Informe um valor para doar.");
      return;
    }
    setCashLoading(true);
    try {
      await DonationServices.registerCash(
        currencyToBackendBRL(amount),
        donorName.trim() || undefined,
      );
      ToastMessage.success(
        "Doação registrada",
        "A doação em dinheiro foi registrada.",
      );
      // O Toast é renderizado dentro do ModalBase; fechar na hora desmonta essa
      // instância antes do toast aparecer. Deixa o modal aberto até o toast subir.
      setTimeout(handleClose, 800);
    } catch {
      ToastMessage.error("Erro ao registrar a doação. Tente novamente.");
    } finally {
      setCashLoading(false);
    }
  }

  return (
    <>
      <ModalBase
        visible={visible && !donation}
        onClose={handleClose}
        title="Fazer uma doação"
      >
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Input
              label="Valor"
              placeholder="R$ 0,00"
              keyboardType="numeric"
              value={amount ? maskCurrencyBRL(amount) : ""}
              onChangeText={setAmount}
            />

            <View style={styles.quickAmounts}>
              {QUICK_AMOUNTS.map((value) => {
                const selected = amountCents === value * 100;
                return (
                  <TouchableOpacity
                    key={value}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => setAmount(String(value * 100))}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}
                    >
                      R$ {value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Input
              label="Nome do doador (opcional)"
              placeholder="Quem está doando?"
              value={donorName}
              onChangeText={setDonorName}
              maxLength={120}
            />
            <Text style={styles.hint}>Deixe em branco se a doação é sua.</Text>

            <Button
              title="Doar via PIX"
              loading={pixLoading}
              disabled={cashLoading}
              onPress={handlePix}
            />

            {isAdmin && (
              <Button
                title="Registrar em dinheiro"
                variant="secondary"
                loading={cashLoading}
                disabled={pixLoading}
                onPress={handleCash}
                styleCustom={styles.cashButton}
              />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </ModalBase>

      {donation && (
        <PixPaymentModal
          visible={!!donation}
          onClose={handleClose}
          payment={{
            amountLabel: donation.amount,
            qrCode: donation.transactionData?.qrCode ?? "",
            status: pixStatus,
          }}
        />
      )}
    </>
  );
}
