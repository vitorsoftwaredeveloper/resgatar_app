import { CoachTarget } from "@/components/CoachTarget";
import { AuthContext } from "@/context/AuthContext";
import { BannerService } from "@/services/BannerService";
import { IBanner } from "@/types/Banner";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { Settings2 } from "lucide-react-native";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  Image,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { ModalBannerManager } from "./ModalBannerManager";
import { BANNER_WIDTH, useStyles } from "./styles";

const AUTO_SCROLL_INTERVAL = 4500;

function useBannerTap(banner: IBanner) {
  const navigation = useNavigation<any>();

  return useCallback(() => {
    if (banner.action.type === "external" && banner.action.value) {
      Linking.openURL(banner.action.value).catch(() => {});
    } else if (banner.action.type === "internal" && banner.action.value) {
      navigation.navigate(banner.action.value);
    }
  }, [banner, navigation]);
}

function BannerSlide({ banner, styles }: { banner: IBanner; styles: ReturnType<typeof useStyles> }) {
  const handleTap = useBannerTap(banner);
  const tappable = banner.action.type !== "none";

  return (
    <Pressable
      style={styles.slide}
      onPress={tappable ? handleTap : undefined}
      disabled={!tappable}
    >
      <Image source={{ uri: banner.banner }} style={styles.image} resizeMode="cover" />
      {banner.title && (
        <View style={styles.overlay}>
          <View style={styles.caption}>
            <Text style={styles.captionTitle}>{banner.title}</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

export function BannerCarousel() {
  const styles = useStyles();
  const { member } = useContext(AuthContext);
  const isAdmin = member?.role === "admin";

  const [banners, setBanners] = useState<IBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [managerVisible, setManagerVisible] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentIndex = useRef(0);

  const load = useCallback(async () => {
    try {
      const data = await BannerService.list();
      setBanners(data);
    } catch {
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  useEffect(() => {
    if (banners.length <= 1) return;

    timerRef.current = setInterval(() => {
      const next = (currentIndex.current + 1) % banners.length;
      scrollRef.current?.scrollTo({ x: next * BANNER_WIDTH, animated: true });
      currentIndex.current = next;
      setActiveIndex(next);
    }, AUTO_SCROLL_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [banners.length]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
      if (idx !== currentIndex.current) {
        currentIndex.current = idx;
        setActiveIndex(idx);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    },
    [],
  );

  if (loading) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.skeleton} />
      </View>
    );
  }

  if (banners.length === 0) {
    if (!isAdmin) return null;
    return (
      <View style={styles.wrapper}>
        <Pressable
          style={styles.empty}
          onPress={() => setManagerVisible(true)}
          accessibilityLabel="Cadastrar primeiro banner"
        >
          <Settings2 size={20} color="#8C7A6B" />
          <Text style={styles.emptyText}>Adicionar banner de campanha</Text>
        </Pressable>
        {managerVisible && (
          <ModalBannerManager
            visible={managerVisible}
            onClose={() => setManagerVisible(false)}
            onSuccess={load}
          />
        )}
      </View>
    );
  }

  return (
    <CoachTarget id="banner-carousel" style={styles.wrapper}>
      <View style={styles.scroll}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={BANNER_WIDTH}
          snapToAlignment="center"
        >
          {banners.map((banner) => (
            <BannerSlide key={banner.id} banner={banner} styles={styles} />
          ))}
        </ScrollView>

        {isAdmin && (
          <Pressable
            style={styles.manageButton}
            onPress={() => setManagerVisible(true)}
            accessibilityLabel="Gerenciar banners"
          >
            <Settings2 size={12} color="#FFFFFF" />
            <Text style={styles.manageButtonText}>Gerenciar</Text>
          </Pressable>
        )}
      </View>

      {banners.length > 1 && (
        <View style={styles.dots}>
          {banners.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      )}

      {managerVisible && (
        <ModalBannerManager
          visible={managerVisible}
          onClose={() => setManagerVisible(false)}
          onSuccess={load}
        />
      )}
    </CoachTarget>
  );
}
