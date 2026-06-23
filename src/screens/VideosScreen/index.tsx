import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { VideoCardSkeleton } from "@/components/Skeleton/VideoCardSkeleton";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { VideoService } from "@/services/VideoService";
import { IVideoFeedItem } from "@/types/Video";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Play, Plus, Search } from "lucide-react-native";
import React, { useCallback, useContext, useMemo, useState } from "react";
import {
  FlatList,
  Image,
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
  const [addVideoVisible, setAddVideoVisible] = useState(false);
  const [playerStartIndex, setPlayerStartIndex] = useState<number | null>(null);

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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return videos;
    return videos.filter(
      (v) =>
        v.title?.toLowerCase().includes(q) ||
        `${v.firstName} ${v.lastName}`.toLowerCase().includes(q),
    );
  }, [search, videos]);

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
