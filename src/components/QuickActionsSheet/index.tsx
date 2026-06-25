import { BirthdayModal } from "@/components/BirthdayModal";
import { CoachTarget } from "@/components/CoachTarget";
import { useCoach } from "@/context/CoachContext";
import { useAppTheme } from "@/context/ThemeContext";
import { Cake, Moon, Sun } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { useStyles } from "./styles";

interface Props {
  visible: boolean;
  onClose: () => void;
  anchorPosition?: { top: number; right: number };
  todayBirthdays?: number;
}

export function QuickActionsSheet({ visible, onClose, anchorPosition, todayBirthdays = 0 }: Props) {
  const styles = useStyles();
  const { mode, toggleTheme, colors } = useAppTheme();
  const { active: tutorialActive } = useCoach();
  const [birthdayVisible, setBirthdayVisible] = useState(false);


  function handleTheme() {
    toggleTheme();
    onClose();
  }

  function handleBirthdays() {
    onClose();
    setBirthdayVisible(true);
  }

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={onClose}
        statusBarTranslucent
      >
        {/* Backdrop cobre a tela inteira — só intercepta toque quando tutorial não está ativo */}
        <TouchableOpacity
          style={styles.overlayBackdrop}
          activeOpacity={1}
          onPress={!tutorialActive ? onClose : undefined}
        />

        <View style={[styles.dropdown, anchorPosition]}>
          <CoachTarget id="quick-darkmode">
            <TouchableOpacity style={styles.item} onPress={handleTheme} activeOpacity={0.7}>
              <View style={styles.itemIcon}>
                {mode === "dark"
                  ? <Sun size={16} color={colors.primary} />
                  : <Moon size={16} color={colors.primary} />}
              </View>
              <Text style={styles.itemLabel}>
                {mode === "dark" ? "Modo claro" : "Modo escuro"}
              </Text>
            </TouchableOpacity>
          </CoachTarget>

          <View style={styles.divider} />

          <CoachTarget id="quick-birthdays">
            <TouchableOpacity style={styles.item} onPress={handleBirthdays} activeOpacity={0.7}>
              <View style={styles.itemIcon}>
                <Cake size={16} color={colors.primary} />
              </View>
              <Text style={styles.itemLabel}>Aniversariantes</Text>
              {todayBirthdays > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{todayBirthdays}</Text>
                </View>
              )}
            </TouchableOpacity>
          </CoachTarget>
        </View>
      </Modal>

      <BirthdayModal
        visible={birthdayVisible}
        onClose={() => setBirthdayVisible(false)}
      />
    </>
  );
}
