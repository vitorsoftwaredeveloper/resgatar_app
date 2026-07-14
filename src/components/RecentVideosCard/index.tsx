import { Avatar } from "@/components/Avatar";
import { CoachTarget } from "@/components/CoachTarget";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { RootStackParamList } from "@/navigation/types";
import { ModalVideoFeed } from "@/screens/VideosScreen/ModalVideoFeed";
import { VideoService } from "@/services/VideoService";
import { IVideoFeedItem } from "@/types/Video";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChevronRight, Clapperboard, Play } from "lucide-react-native";
import React, { useCallback, useContext, useRef, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { useStyles } from "./styles";

// Prévia dos últimos vídeos publicados pela comunidade — reaproveita o
// ModalVideoFeed (mesmo player de /Videos) para tocar direto a partir do card.
// Portado de resgatar-browser (RecentVideosCard); busca os próprios dados.

const RECENT_VIDEOS_LIMIT = 6;

export function RecentVideosCard() {
  const styles = useStyles();
  const { colors } = useAppTheme();
  const { member, sessionVersion } = useContext(AuthContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [videos, setVideos] = useState<IVideoFeedItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [playerStartIndex, setPlayerStartIndex] = useState<number | null>(null);
  const fetchedSessionVersion = useRef<number | null>(null);

  const fetchVideos = useCallback(() => {
    return VideoService.listAllVideos(1, RECENT_VIDEOS_LIMIT)
      .then((data) => setVideos(data.items))
      .catch(() => setVideos([]))
      .finally(() => setLoaded(true));
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (fetchedSessionVersion.current === sessionVersion) return;
      fetchedSessionVersion.current = sessionVersion;
      fetchVideos();
    }, [sessionVersion, fetchVideos]),
  );

  return (
    <CoachTarget id="recent-videos-card">
      <View style={styles.container}>
        <Pressable
          style={styles.header}
          onPress={() => navigation.navigate("Videos")}
          accessibilityRole="button"
          accessibilityLabel="Ver todos os vídeos"
        >
          <Text style={styles.headerTitle}>Vídeos recentes</Text>
          <ChevronRight size={16} color={colors.textMuted} />
        </Pressable>

        {!loaded ? (
          <FlatList
            data={[0, 1, 2]}
            keyExtractor={(i) => String(i)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.list}
            renderItem={() => <View style={styles.skeletonThumb} />}
          />
        ) : videos.length === 0 ? (
          <View style={styles.emptyState}>
            <Clapperboard size={22} color={colors.textMuted} />
            <Text style={styles.emptyText}>Nenhum vídeo publicado ainda</Text>
          </View>
        ) : (
          <FlatList
            data={videos}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => (
              <Pressable
                style={styles.item}
                onPress={() => setPlayerStartIndex(index)}
              >
                <View style={styles.thumbWrapper}>
                  <Image
                    source={{ uri: item.thumbnail }}
                    style={styles.thumb}
                    resizeMode="cover"
                  />
                  <View style={styles.playIcon}>
                    <Play size={16} color="#fff" fill="#fff" />
                  </View>
                </View>
                <View style={styles.itemInfo}>
                  <Avatar photo={item.profileImage ?? undefined} size={22} />
                  <View style={styles.itemTexts}>
                    {!!item.title && (
                      <Text style={styles.itemTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                    )}
                    <Text style={styles.itemAuthor} numberOfLines={1}>
                      {item.firstName}
                    </Text>
                  </View>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>

      {playerStartIndex !== null && (
        <ModalVideoFeed
          visible={playerStartIndex !== null}
          videos={videos}
          startIndex={playerStartIndex}
          currentMemberId={member?._id}
          onClose={() => setPlayerStartIndex(null)}
          onVideoRemoved={() => fetchVideos()}
        />
      )}
    </CoachTarget>
  );
}
