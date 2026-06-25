import { QuickActionsSheet } from "@/components/QuickActionsSheet";
import { useCoach } from "@/context/CoachContext";
import { useAppTheme } from "@/context/ThemeContext";
import { useTodayBirthdays } from "@/hooks/useTodayBirthdays";
import { resolveAvatarUri } from "@/utils/image";
import { useIsFocused } from "@react-navigation/native";
import { ChevronLeft, EllipsisVertical } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { CoachTarget } from "../CoachTarget";
import { LogoResgatar } from "../Svg/Logo";
import { useStyles } from "./styles";

interface Props {
  name: string;
  photo?: string;
  onBack?: () => void;
}

export function Header({ name, photo, onBack }: Props) {
  const { colors } = useAppTheme();
  const styles = useStyles();
  const { registerAction, unregisterAction } = useCoach();
  const todayBirthdays = useTodayBirthdays();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; right: number } | undefined>();
  const buttonRef = useRef<View>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    registerAction("header-quickactions", handleOpenSheet);
    return () => unregisterAction("header-quickactions");
  }, []);

  useEffect(() => {
    if (!isFocused) setSheetVisible(false);
  }, [isFocused]);

  const avatarUri = resolveAvatarUri(photo);

  function handleOpenSheet() {
    buttonRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
      setAnchorPosition({ top: pageY + height + 4, right: 16 });
      setSheetVisible(true);
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Voltar"
          >
            <ChevronLeft size={22} color={colors.primary} />
          </TouchableOpacity>
        )}

        <View style={styles.logo}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.photo} />
          ) : (
            <LogoResgatar size={100} color={colors.primary} />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.hello}>Olá,</Text>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {name}
          </Text>
        </View>
        <CoachTarget id="header-quickactions">
          <TouchableOpacity
            ref={buttonRef}
            testID="theme-toggle"
            accessibilityLabel="Ações rápidas"
            onPress={handleOpenSheet}
            style={styles.themeToggle}
          >
            <EllipsisVertical size={18} color={colors.primary} />
            {todayBirthdays > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{todayBirthdays}</Text>
              </View>
            )}
          </TouchableOpacity>
        </CoachTarget>
      </View>

      <QuickActionsSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        anchorPosition={anchorPosition}
        todayBirthdays={todayBirthdays}
      />
    </View>
  );
}
