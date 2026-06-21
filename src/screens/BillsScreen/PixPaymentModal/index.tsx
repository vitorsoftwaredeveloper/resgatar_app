import { ModalBase } from "@/components/ModalBase";
import { ChargeContext } from "@/context/ChargeContext";
import { TRANSACTION_STATUS } from "@/types/Charge";
import Clipboard from "@react-native-clipboard/clipboard";
import { Check, Copy } from "lucide-react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useStyles } from "./styles";

interface PixPaymentModalProps {
  visible: boolean;
  onClose: () => void;
}

export function PixPaymentModal({ visible, onClose }: PixPaymentModalProps) {
  const { charge } = useContext(ChargeContext);
  const styles = useStyles();
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (value: string) => {
    Clipboard.setString(value);
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.05,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          damping: 14,
          stiffness: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // A confirmação chega de forma assíncrona via push (FCM), tratada no
  // ChargeContext, que também recarrega os dados do membro. Aqui mantemos o
  // "Pago" visível por um instante antes de fechar o modal automaticamente.
  useEffect(() => {
    if (charge.status !== TRANSACTION_STATUS.APPROVED) return;

    const timeout = setTimeout(onClose, 1800);

    return () => clearTimeout(timeout);
  }, [charge.status]);

  return (
    <ModalBase onClose={onClose} visible={visible} title="Pagamento PIX">
      <Animated.View
        style={[
          styles.container,
          { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.container}>
          {charge.status === TRANSACTION_STATUS.PENDING && (
            <Animated.View
              style={[styles.badge, { transform: [{ scale: pulse }] }]}
            >
              <Text style={styles.badgeText}>Aguardando pagamento</Text>
            </Animated.View>
          )}

          {charge.status === TRANSACTION_STATUS.APPROVED && (
            <View style={[styles.badge, styles.badgePaid]}>
              <Text style={styles.badgePaidText}>Pago</Text>
            </View>
          )}

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Valor a pagar</Text>
            <Text style={styles.amount}>
              R$ {`${charge.transactionAmount}`.replace(".", ",")}
            </Text>
          </View>

          <View style={styles.qrContainer}>
            <View style={styles.qrBox}>
              <QRCode
                value={charge.transactionData.qrCode}
                size={200}
                color="#3E3328"
                backgroundColor="#00000000"
              />
            </View>
          </View>

          <Text style={styles.helperText}>
            Escaneie o QR Code ou copie o código PIX
          </Text>

          <View style={styles.pixCodeContainer}>
            <Text
              style={styles.pixCode}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {charge.transactionData.qrCode}
            </Text>

            <View style={styles.containerCopy}>
              {isCopied && (
                <View style={styles.tooltipContainer}>
                  <View style={styles.balloon}>
                    <Text style={styles.balloonText}>Copiado!</Text>
                  </View>

                  <View style={styles.arrow} />
                </View>
              )}

              <Pressable
                style={styles.copyButton}
                onPress={() => {
                  setIsCopied(true);
                  copyToClipboard(charge.transactionData.qrCode);
                }}
              >
                {isCopied ? (
                  <Check size={18} color="#fff" />
                ) : (
                  <Copy size={18} color="#fff" />
                )}
              </Pressable>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Após o pagamento, a confirmação será enviada automaticamente em
              até 5 minutos.
            </Text>
          </View>
        </View>
      </Animated.View>
    </ModalBase>
  );
}
