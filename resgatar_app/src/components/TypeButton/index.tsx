import { Pressable, Text, View } from "react-native";
import { styles, typeColors } from "./styles";

export type NotificationType = "info" | "alert" | "warning";

type TypeButtonProps = {
  label: string;
  icon: React.ReactNode;
  type: NotificationType;
  selected: boolean;
  onPress: () => void;
};

export function TypeButton({
  label,
  icon,
  type,
  selected,
  onPress,
}: TypeButtonProps) {
  const colors = typeColors[type];

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.typeButton,
        selected && {
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderWidth: 2,
        },
      ]}
    >
      <View style={{ marginBottom: 4 }}>{icon}</View>

      <Text
        style={[
          styles.typeButtonText,
          selected && {
            color: colors.text,
            fontWeight: "600",
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
