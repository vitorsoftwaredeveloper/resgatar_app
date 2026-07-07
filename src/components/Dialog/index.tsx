import React from "react";
import { Modal, View, Text, Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useStyles } from "./styles";
import { Button } from "../Button";

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
  children?: React.ReactNode;
};

export function Dialog({
  visible,
  title,
  description,
  onClose,
  actions = [],
  children,
}: DialogProps) {
  const styles = useStyles();

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
      transparent
      presentationStyle="overFullScreen"
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Pressable style={styles.overlay} onPress={onClose}>
          <Pressable style={styles.container} onPress={() => {}}>
            {title && <Text style={styles.title}>{title}</Text>}
            {description && <Text style={styles.description}>{description}</Text>}
            {children}

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
      </GestureHandlerRootView>
    </Modal>
  );
}
