import { useAppTheme } from "@/context/ThemeContext";
import { resolveAvatarUri } from "@/utils/image";
import { Camera, UserRound } from "lucide-react-native";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useStyles } from "./styles";

interface AvatarProps {
  photo?: string | null;
  size?: number;
  onPress?: () => void;
  /** Mostra um selo de câmera indicando que a foto é editável. */
  editable?: boolean;
}

export function Avatar({ photo, size = 56, onPress, editable }: AvatarProps) {
  const { colors } = useAppTheme();
  const styles = useStyles();

  const uri = resolveAvatarUri(photo);
  const circleStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const content = (
    <View>
      <View style={[styles.circle, circleStyle]}>
        {uri ? (
          <Image source={{ uri }} style={[styles.image, circleStyle]} />
        ) : (
          <UserRound size={size * 0.45} color={colors.primary} />
        )}
      </View>

      {editable && (
        <View style={styles.badge}>
          <Camera size={14} color={colors.white} />
        </View>
      )}
    </View>
  );

  if (!onPress) return content;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      {content}
    </TouchableOpacity>
  );
}
