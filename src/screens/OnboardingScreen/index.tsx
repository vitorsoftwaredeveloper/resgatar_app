import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BookOpen,
  HandCoins,
  PlayCircle,
  UserCircle,
} from "lucide-react-native";
import { Button } from "@/components/Button";
import { LogoResgatar } from "@/components/Svg/Logo";
import { useAppTheme } from "@/context/ThemeContext";
import { useStyles } from "./styles";

interface Slide {
  key: string;
  title: string;
  description: string;
  icon: (color: string) => React.ReactNode;
}

const SLIDES: Slide[] = [
  {
    key: "welcome",
    title: "Bem-vindo à Resgatar",
    description:
      "Tudo o que a comunidade precisa em um só lugar. Deslize para conhecer o aplicativo.",
    icon: () => <LogoResgatar size={140} />,
  },
  {
    key: "liturgy",
    title: "Liturgia diária",
    description:
      "Acompanhe as leituras, o salmo e o evangelho de cada dia, com a cor do tempo litúrgico.",
    icon: (color) => <BookOpen size={96} color={color} strokeWidth={1.5} />,
  },
  {
    key: "bills",
    title: "Suas contribuições",
    description:
      "Veja o histórico mensal e pague sua contribuição via PIX com QR Code, de forma rápida e segura.",
    icon: (color) => <HandCoins size={96} color={color} strokeWidth={1.5} />,
  },
  {
    key: "videos",
    title: "Vídeos da comunidade",
    description:
      "Assista e compartilhe vídeos dos membros. Use os filtros para ver os vídeos de cada pessoa.",
    icon: (color) => <PlayCircle size={96} color={color} strokeWidth={1.5} />,
  },
  {
    key: "profile",
    title: "Seu perfil",
    description:
      "Atualize seus dados, adicione uma foto e mantenha tudo sempre em dia. Vamos começar!",
    icon: (color) => <UserCircle size={96} color={color} strokeWidth={1.5} />,
  },
];

interface Props {
  onDone: () => void;
}

export function OnboardingScreen({ onDone }: Props) {
  const styles = useStyles();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const isLast = index === SLIDES.length - 1;

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = Math.round(e.nativeEvent.contentOffset.x / width);
      if (next !== index) setIndex(next);
    },
    [index, width],
  );

  const goNext = useCallback(() => {
    if (isLast) {
      onDone();
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  }, [isLast, index, onDone]);

  const renderItem = useCallback(
    ({ item }: { item: Slide }) => (
      <View style={[styles.slide, { width }]}>
        <View style={styles.iconWrapper}>{item.icon(colors.primary)}</View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    ),
    [styles, width, colors.primary],
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        {!isLast ? (
          <TouchableOpacity onPress={onDone} hitSlop={12}>
            <Text style={styles.skip}>Pular</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, i) => ({
          length: width,
          offset: width * i,
          index: i,
        })}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.dots}>
          {SLIDES.map((s, i) => (
            <View
              key={s.key}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>

        <Button
          title={isLast ? "Começar" : "Próximo"}
          onPress={goNext}
        />
      </View>
    </View>
  );
}
