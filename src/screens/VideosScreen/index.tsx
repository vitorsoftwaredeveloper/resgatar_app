import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { VideoCardSkeleton } from "@/components/Skeleton/VideoCardSkeleton";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { VideoService } from "@/services/VideoService";
import { IVideoFeedItem } from "@/types/Video";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ChevronLeft, ChevronRight, Play, Plus, Search } from "lucide-react-native";
import React, { useCallback, useContext, useMemo, useRef, useState } from "react";
import {
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

export function VideosScreen() {
  const navigation = useNavigation();
  const styles = useStyles();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { member } = useContext(AuthContext);
  const { width } = useWindowDimensions();

  const [videos, setVideos] = useState<IVideoFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
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

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await VideoService.listAllVideos();
      setVideos(data);
    } catch {
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handleVideoRemoved = useCallback((videoId: string) => {
    setVideos((prev) => prev.filter((v) => v._id !== videoId));
  }, []);

  const members = useMemo(() => {
    const seen = new Set<string>();
    return videos.reduce<Array<{ memberId: string; firstName: string; lastName: string; profileImage: string | null }>>((acc, v) => {
      if (!seen.has(v.memberId)) {
        seen.add(v.memberId);
        acc.push({ memberId: v.memberId, firstName: v.firstName, lastName: v.lastName, profileImage: v.profileImage });
      }
      return acc;
    }, []);
  }, [videos]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return videos.filter((v) => {
      const matchesMember = selectedMemberId ? v.memberId === selectedMemberId : true;
      const matchesSearch = q
        ? v.title?.toLowerCase().includes(q) || `${v.firstName} ${v.lastName}`.toLowerCase().includes(q)
        : true;
      return matchesMember && matchesSearch;
    });
  }, [search, selectedMemberId, videos]);

  const cardWidth = width - 32;
  const thumbnailHeight = Math.round((cardWidth * 9) / 16);

  const renderItem = ({ item, index }: { item: IVideoFeedItem; index: number }) => (
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
            leftIcon={<Search size={16} color={colors.textMuted} />}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            flex={0}
          />
        </View>

        {!loading && members.length >= 1 && (
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
              {members.map((m) => {
                const active = selectedMemberId === m.memberId;
                return (
                  <TouchableOpacity
                    key={m.memberId}
                    style={[styles.memberChip, active && styles.memberChipActive]}
                    onPress={() => setSelectedMemberId(active ? null : m.memberId)}
                    activeOpacity={0.75}
                  >
                    <Avatar photo={m.profileImage} size={36} />
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
          ) : filtered.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>
                {search.trim() ? "Nenhum vídeo encontrado." : "Nenhum vídeo publicado ainda."}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
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
            load();
          }}
        />
      )}

      {playerStartIndex !== null && (
        <ModalVideoFeed
          visible={playerStartIndex !== null}
          videos={filtered}
          startIndex={playerStartIndex}
          currentMemberId={member?._id}
          onClose={() => setPlayerStartIndex(null)}
          onVideoRemoved={handleVideoRemoved}
        />
      )}
    </View>
  );
}
