import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
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
import { useCoach } from "@/context/CoachContext";
import { useAppTheme } from "@/context/ThemeContext";
import { useStyles } from "./styles";

interface Slide {
  key: string;
  title: string;
  description: string;
  // Print da tela (opcional). Quando definido, é mostrado dentro da moldura
  // de celular; caso contrário, cai no ícone de fallback.
  image?: ImageSourcePropType;
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
    // image: require("../../../assets/onboarding/liturgy.png"),
    icon: (color) => <BookOpen size={96} color={color} strokeWidth={1.5} />,
  },
  {
    key: "bills",
    title: "Suas contribuições",
    description:
      "Veja o histórico mensal e pague sua contribuição via PIX com QR Code, de forma rápida e segura.",
    // image: require("../../../assets/onboarding/bills.png"),
    icon: (color) => <HandCoins size={96} color={color} strokeWidth={1.5} />,
  },
  {
    key: "videos",
    title: "Vídeos da comunidade",
    description:
      "Assista e compartilhe vídeos dos membros. Use os filtros para ver os vídeos de cada pessoa.",
    // image: require("../../../assets/onboarding/videos.png"),
    icon: (color) => <PlayCircle size={96} color={color} strokeWidth={1.5} />,
  },
  {
    key: "profile",
    title: "Seu perfil",
    description:
      "Atualize seus dados, adicione uma foto e mantenha tudo sempre em dia. Vamos começar!",
    // image: require("../../../assets/onboarding/profile.png"),
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
  const { start: startCoach } = useCoach();

  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const isLast = index === SLIDES.length - 1;

  // Conclui o carrossel e inicia o tour guiado de balões nas telas reais.
  const finish = useCallback(() => {
    onDone();
    setTimeout(() => startCoach(), 450);
  }, [onDone, startCoach]);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = Math.round(e.nativeEvent.contentOffset.x / width);
      if (next !== index) setIndex(next);
    },
    [index, width],
  );

  const goNext = useCallback(() => {
    if (isLast) {
      finish();
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  }, [isLast, index, finish]);

  const renderItem = useCallback(
    ({ item }: { item: Slide }) => (
      <View style={[styles.slide, { width }]}>
        {item.image ? (
          <View style={styles.phoneFrame}>
            <Image
              source={item.image}
              style={styles.phoneImage}
              resizeMode="cover"
            />
          </View>
        ) : (
          <View style={styles.iconWrapper}>{item.icon(colors.primary)}</View>
        )}
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

        <Button title={isLast ? "Começar" : "Próximo"} onPress={goNext} />
      </View>
    </View>
  );
}
