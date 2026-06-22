import { useAppTheme } from "@/context/ThemeContext";
import { resolveAvatarUri } from "@/utils/image";
import { ChevronLeft, Moon, Sun } from "lucide-react-native";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { LogoResgatar } from "../Svg/Logo";
import { useStyles } from "./styles";

interface Props {
  name: string;
  photo?: string;
  onBack?: () => void;
}

export function Header({ name, photo, onBack }: Props) {
  const { mode, toggleTheme, colors } = useAppTheme();
  const styles = useStyles();

  const avatarUri = resolveAvatarUri(photo);

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
        <TouchableOpacity
          testID="theme-toggle"
          accessibilityLabel={mode === "dark" ? "Desativar modo escuro" : "Ativar modo escuro"}
          onPress={toggleTheme}
          style={styles.themeToggle}
        >
          {mode === "dark" ? (
            <Sun size={18} color={colors.primary} />
          ) : (
            <Moon size={18} color={colors.primary} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
