import React from "react";
import { Modal, View, Text, Pressable } from "react-native";
import { styles } from "./styles";
import { Button } from "../Button";

type DialogAction = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "danger" | "secondary";
};

type DialogProps = {
  visible: boolean;
  title?: string;
  description?: string;
  onClose?: () => void;
  actions?: DialogAction[];
};

export function Dialog({
  visible,
  title,
  description,
  onClose,
  actions = [],
}: DialogProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={() => {}}>
          {description && <Text style={styles.description}>{description}</Text>}

          <View style={styles.actions}>
            {actions.map((action, index) => (
              <Button
                key={index}
                title={action.label}
                onPress={action.onPress}
                styleCustom={[
                  styles.button,
                  action.variant === "danger" && styles.dangerButton,
                  action.variant === "secondary" && styles.secondaryButton,
                ]}
              />
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
