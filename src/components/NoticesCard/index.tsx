import { useAppTheme } from "@/context/ThemeContext";
import { Megaphone } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { useStyles } from "./styles";

interface Notice {
  id: string;
  title: string;
  date: string;
}

// Placeholder data — swap for a real source (push/backend) in a later step.
const MOCK_NOTICES: Notice[] = [
  { id: "1", title: "Missa de domingo às 19h", date: "Esta semana" },
  { id: "2", title: "Reunião do grupo de jovens", date: "Sábado, 16h" },
  { id: "3", title: "Campanha do agasalho aberta", date: "Até o fim do mês" },
];

export function NoticesCard() {
  const styles = useStyles();
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      {MOCK_NOTICES.map((notice, i) => (
        <View
          key={notice.id}
          style={[styles.row, i < MOCK_NOTICES.length - 1 && styles.rowBorder]}
        >
          <View style={styles.iconWrap}>
            <Megaphone size={18} color={colors.primary} />
          </View>
          <View style={styles.texts}>
            <Text style={styles.title} numberOfLines={2}>
              {notice.title}
            </Text>
            <Text style={styles.date}>{notice.date}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
