import React from "react";
import { View, Text, Pressable } from "react-native";
import { styles } from "./styles";
import { Button } from "../Button";
import { ModalBase } from "../ModalBase";

type DialogAction = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
};

type DialogProps = {
  visible: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
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
    <ModalBase onClose={onClose} visible={visible} title="">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={() => {}}>
          {title && <Text style={styles.title}>{title}</Text>}
          {description && <Text style={styles.description}>{description}</Text>}

          <View style={styles.actions}>
            {actions.map((action, index) => (
              <Button
                key={index}
                title={action.label}
                onPress={action.onPress}
                styleCustom={[
                  styles.button,
                  action.variant === "primary" && styles.primaryButton,
                  action.variant === "secondary" && styles.secondaryButton,
                ]}
              />
            ))}
          </View>
        </Pressable>
      </Pressable>
    </ModalBase>
  );
}
