import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { VideoCardSkeleton } from "@/components/Skeleton/VideoCardSkeleton";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { VideoService } from "@/services/VideoService";
import { IVideoFeedItem } from "@/types/Video";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Play,
  Plus,
  Search,
} from "lucide-react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/Avatar";
import { ModalAddVideo } from "./ModalAddVideo";
import { ModalVideoFeed } from "./ModalVideoFeed";
import { useStyles } from "./styles";

const PAGE_SIZE = 10;

type MemberOption = {
  memberId: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
};

function DotsLoader({ color }: { color: string }) {
  const dots = [
    useRef(new Animated.Value(0.25)).current,
    useRef(new Animated.Value(0.25)).current,
    useRef(new Animated.Value(0.25)).current,
  ];

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160),
          Animated.timing(dot, {
            toValue: 1,
            duration: 280,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.25,
            duration: 280,
            useNativeDriver: true,
          }),
          Animated.delay((dots.length - 1 - i) * 160),
        ]),
      ),
    );
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 6,
        justifyContent: "center",
        paddingVertical: 20,
      }}
    >
      {dots.map((dot, i) => (
        <Animated.View
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: 4,
            backgroundColor: color,
            opacity: dot,
          }}
        />
      ))}
    </View>
  );
}

export function VideosScreen() {
  const navigation = useNavigation();
  const styles = useStyles();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { member } = useContext(AuthContext);
  const { width } = useWindowDimensions();

  const [items, setItems] = useState<IVideoFeedItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [committedSearch, setCommittedSearch] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [memberOptions, setMemberOptions] = useState<MemberOption[]>([]);
  const [addVideoVisible, setAddVideoVisible] = useState(false);
  const [playerStartIndex, setPlayerStartIndex] = useState<number | null>(null);

  const memberScrollRef = useRef<ScrollView>(null);
  const memberScrollX = useRef(0);
  const memberContentWidth = useRef(0);
  const memberViewportWidth = useRef(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateMemberArrows = useCallback(() => {
    const x = memberScrollX.current;
    const maxX = memberContentWidth.current - memberViewportWidth.current;
    setCanScrollLeft(x > 4);
    setCanScrollRight(maxX - x > 4);
  }, []);

  const onMemberScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      memberScrollX.current = e.nativeEvent.contentOffset.x;
      updateMemberArrows();
    },
    [updateMemberArrows],
  );

  const scrollMembersBy = useCallback((delta: number) => {
    memberScrollRef.current?.scrollTo({
      x: Math.max(0, memberScrollX.current + delta),
      animated: true,
    });
  }, []);

  const load = useCallback(
    async (pageToLoad: number) => {
      if (pageToLoad === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      try {
        const data = await VideoService.listAllVideos(pageToLoad, PAGE_SIZE, {
          title: committedSearch || undefined,
          memberId: selectedMemberId || undefined,
        });
        setItems((prev) =>
          pageToLoad === 1 ? data.items : [...prev, ...data.items],
        );
        setPage(data.page);
        setTotalPages(Math.max(1, data.totalPages));
      } catch {
        if (pageToLoad === 1) setItems([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [committedSearch, selectedMemberId],
  );

  const handleSearch = useCallback(() => {
    const trimmed = search.trim();
    setCommittedSearch(trimmed);
  }, [search]);

  const loadMemberOptions = useCallback(async () => {
    try {
      const data = await VideoService.listAllVideos(1, 50);
      const seen = new Set<string>();
      const options: MemberOption[] = [];
      data.items.forEach((v) => {
        if (!seen.has(v.memberId)) {
          seen.add(v.memberId);
          options.push({
            memberId: v.memberId,
            firstName: v.firstName,
            lastName: v.lastName,
            profileImage: v.profileImage,
          });
        }
      });
      setMemberOptions(options);
    } catch {
      setMemberOptions([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load(1);
      loadMemberOptions();
    }, [load, loadMemberOptions]),
  );

  const isFirstSearchRender = useRef(true);
  useEffect(() => {
    if (isFirstSearchRender.current) {
      isFirstSearchRender.current = false;
      return;
    }
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [committedSearch]);

  const isFirstMemberRender = useRef(true);
  useEffect(() => {
    if (isFirstMemberRender.current) {
      isFirstMemberRender.current = false;
      return;
    }
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMemberId]);

  const handleEndReached = useCallback(() => {
    if (!loadingMore && !loading && page < totalPages) {
      load(page + 1);
    }
  }, [loadingMore, loading, page, totalPages, load]);

  const handleVideoRemoved = useCallback(
    (videoId: string) => {
      setItems((prev) => prev.filter((v) => v._id !== videoId));
      loadMemberOptions();
    },
    [loadMemberOptions],
  );

  const cardWidth = width - 32;
  const thumbnailHeight = Math.round((cardWidth * 9) / 16);
  const isFiltering = Boolean(committedSearch || selectedMemberId);

  const renderItem = ({
    item,
    index,
  }: {
    item: IVideoFeedItem;
    index: number;
  }) => (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() => setPlayerStartIndex(index)}
      activeOpacity={0.85}
    >
      <View>
        <Image
          source={{ uri: item.thumbnail }}
          style={{ width: cardWidth, height: thumbnailHeight }}
          resizeMode="cover"
        />
        <View style={styles.playIcon}>
          <Play size={22} color="#fff" fill="#fff" />
        </View>
      </View>
      <View style={styles.videoCardInfo}>
        <Avatar photo={item.profileImage} size={36} />
        <View style={styles.videoCardText}>
          {item.title ? (
            <Text style={styles.videoTitle}>{item.title}</Text>
          ) : null}
          <Text style={styles.videoAuthor} numberOfLines={1}>
            {item.firstName} {item.lastName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        name={member?.firstName + " " + member?.lastName}
        photo={member?.profileImage}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <View style={styles.searchBar}>
          <Input
            placeholder="Buscar vídeos..."
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            rightIcon={
              <TouchableOpacity
                onPress={handleSearch}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                activeOpacity={0.7}
                accessibilityLabel="Buscar"
              >
                <View style={styles.searchButton}>
                  <Search size={14} color={colors.white} strokeWidth={2.5} />
                </View>
              </TouchableOpacity>
            }
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            flex={0}
          />
        </View>

        {memberOptions.length >= 1 && (
          <View style={styles.memberFilterWrapper}>
            <ScrollView
              ref={memberScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={onMemberScroll}
              onContentSizeChange={(w) => {
                memberContentWidth.current = w;
                updateMemberArrows();
              }}
              onLayout={(e) => {
                memberViewportWidth.current = e.nativeEvent.layout.width;
                updateMemberArrows();
              }}
              contentContainerStyle={styles.memberFilterRow}
            >
              {memberOptions.map((m) => {
                const active = selectedMemberId === m.memberId;
                return (
                  <TouchableOpacity
                    key={m.memberId}
                    style={styles.memberItem}
                    onPress={() =>
                      setSelectedMemberId(active ? null : m.memberId)
                    }
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.memberName,
                        active && styles.memberNameActive,
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {m.firstName}
                    </Text>
                    <View
                      style={[
                        styles.memberRing,
                        active && styles.memberRingActive,
                      ]}
                    >
                      <View style={styles.memberRingInner}>
                        <Avatar photo={m.profileImage} size={48} />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {canScrollLeft && (
              <TouchableOpacity
                style={[styles.memberArrow, styles.memberArrowLeft]}
                onPress={() => scrollMembersBy(-160)}
                activeOpacity={0.8}
              >
                <ChevronLeft size={20} color={colors.text} />
              </TouchableOpacity>
            )}

            {canScrollRight && (
              <TouchableOpacity
                style={[styles.memberArrow, styles.memberArrowRight]}
                onPress={() => scrollMembersBy(160)}
                activeOpacity={0.8}
              >
                <ChevronRight size={20} color={colors.text} />
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.body}>
          {loading ? (
            <View style={styles.list}>
              {Array.from({ length: 4 }).map((_, i) => (
                <VideoCardSkeleton key={i} />
              ))}
            </View>
          ) : items.length === 0 ? (
            <View style={styles.centered}>
              <View style={styles.emptyIconWrap}>
                {isFiltering ? (
                  <Search size={26} color={colors.primary} />
                ) : (
                  <Clapperboard size={26} color={colors.primary} />
                )}
              </View>
              <Text style={styles.emptyTitle}>
                {isFiltering
                  ? "Nenhum vídeo encontrado"
                  : "Nenhum vídeo por aqui ainda"}
              </Text>
              <Text style={styles.emptyText}>
                {isFiltering
                  ? "Tente outro termo de busca ou remova o filtro por membro."
                  : "Toque no + para publicar o primeiro vídeo da comunidade."}
              </Text>
              {isFiltering && (
                <TouchableOpacity
                  onPress={() => {
                    setSearch("");
                    setCommittedSearch("");
                    setSelectedMemberId(null);
                  }}
                  style={styles.clearFiltersButton}
                  activeOpacity={0.75}
                >
                  <Text style={styles.clearFiltersText}>Limpar busca</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.25}
              ListFooterComponent={
                loadingMore ? <DotsLoader color={colors.textMuted} /> : null
              }
            />
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => setAddVideoVisible(true)}
        activeOpacity={0.85}
        accessibilityLabel="Cadastrar vídeo"
      >
        <Plus size={28} color={colors.white} strokeWidth={2.5} />
      </TouchableOpacity>

      {addVideoVisible && (
        <ModalAddVideo
          visible={addVideoVisible}
          onClose={() => setAddVideoVisible(false)}
          onSuccess={() => {
            setAddVideoVisible(false);
            load(1);
            loadMemberOptions();
          }}
        />
      )}

      {playerStartIndex !== null && (
        <ModalVideoFeed
          visible={playerStartIndex !== null}
          videos={items}
          startIndex={playerStartIndex}
          currentMemberId={member?._id}
          onClose={() => setPlayerStartIndex(null)}
          onVideoRemoved={handleVideoRemoved}
        />
      )}
    </View>
  );
}
