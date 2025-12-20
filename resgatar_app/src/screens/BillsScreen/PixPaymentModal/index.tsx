import React, { useContext, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Modal } from "react-native";
import { X, Copy, QrCode } from "lucide-react-native";
import { styles } from "./styles";
import { ChargeContext } from "@/context/ChargeContext";
import QRCode from "react-native-qrcode-svg";
import { Animated } from "react-native";
import { useEffect, useRef } from "react";
import { IconButton } from "@/components/IconButton";
import { TRANSACTION_STATUS } from "@/types/Charge";
import { AuthContext } from "@/context/AuthContext";

interface PixPaymentModalProps {
  visible: boolean;
  onClose: () => void;
}

export function PixPaymentModal({ visible, onClose }: PixPaymentModalProps) {
  const { charge, consultCharge } = useContext(ChargeContext);
  const { reloadMemberData } = useContext(AuthContext);
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

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
      ])
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

  useEffect(() => {
    let active = true;

    const poll = async () => {
      if (!active) return;

      await consultCharge();

      if (charge.status === TRANSACTION_STATUS.PENDING) {
        setTimeout(poll, 5000);
      }
    };

    poll();

    return () => {
      active = false;
    };
  }, [charge.status]);

  useEffect(() => {
    if (charge.status === TRANSACTION_STATUS.APPROVED) {
      setTimeout(() => {
        reloadMemberData();
        onClose();
      }, 2500);
    }
  }, [charge.status]);

  return (
    <Modal visible={visible} onRequestClose={onClose} style={styles.modal}>
      <Animated.View
        style={[
          styles.container,
          { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.qrIcon}>
              <QrCode size={30} color="#fff" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Pagamento PIX</Text>
              <Text style={styles.subtitle}>Dezembro 2024</Text>
            </View>

            <IconButton onPress={onClose} size={22} icon={X} color="#fff" />
          </View>

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
            <Text style={styles.amount}>R$ {charge.transactionAmount}</Text>
          </View>

          <View style={styles.qrContainer}>
            <View style={styles.qrBox}>
              <QRCode
                value={charge.transactionData.qrCode}
                size={200}
                color="#3E3328"
                backgroundColor="transparent"
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

            <Pressable style={styles.copyButton}>
              <Copy size={18} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Após o pagamento, a confirmação será enviada automaticamente em
              até 5 minutos.
            </Text>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}
