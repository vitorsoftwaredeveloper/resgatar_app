import { Avatar } from "@/components/Avatar";
import { VideoService } from "@/services/VideoService";
import { IVideoMember, IVideoResponse } from "@/types/Video";
import { ChevronLeft, Trash2 } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";
import { styles } from "./styles";

function ThumbnailImage({ uri, width, height }: { uri: string; width: number; height: number }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <View style={{ width, height }}>
      <Image
        source={{ uri }}
        style={{ width, height }}
        resizeMode="cover"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
      {!loaded && (
        <View style={StyleSheet.absoluteFill}>
          <ActivityIndicator color="#fff" size="large" style={StyleSheet.absoluteFill} />
        </View>
      )}
    </View>
  );
}

interface IModalVideoFeed {
  visible: boolean;
  member: IVideoMember;
  isOwner?: boolean;
  onClose: () => void;
  onVideoRemoved?: () => void;
}

export function ModalVideoFeed({ visible, member, isOwner, onClose, onVideoRemoved }: IModalVideoFeed) {
  const { width, height } = useWindowDimensions();
  const [videos, setVideos] = useState<IVideoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    setCurrentIndex(0);
    VideoService.listVideosByMember(member.memberId)
      .then(setVideos)
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, [visible, member.memberId]);

  const handleDelete = (videoId: string) => {
    Alert.alert("Remover vídeo", "Tem certeza que deseja remover este vídeo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await VideoService.removeVideo(videoId);
            setVideos((prev) => {
              const updated = prev.filter((v) => v._id !== videoId);
              if (updated.length === 0) {
                onClose();
              } else {
                setCurrentIndex((idx) => Math.min(idx, updated.length - 1));
              }
              return updated;
            });
            onVideoRemoved?.();
          } catch {
            Alert.alert("Erro", "Não foi possível remover o vídeo.");
          }
        },
      },
    ]);
  };

  const viewabilityCallbacks = useRef([
    {
      viewabilityConfig: { itemVisiblePercentThreshold: 60 },
      onViewableItemsChanged: ({ viewableItems }: any) => {
        const idx = viewableItems[0]?.index;
        if (idx != null) setCurrentIndex(idx);
      },
    },
  ]);

  const playerHeight = Math.round((width * 9) / 16);

  const renderItem = ({
    item,
    index,
  }: {
    item: IVideoResponse;
    index: number;
  }) => {
    const isActive = index === currentIndex;

    return (
      <View style={[styles.videoItem, { width, height }]}>
        <View style={styles.playerWrapper}>
          {isActive ? (
            <YoutubePlayer
              key={item._id}
              height={playerHeight}
              width={width}
              play
              videoId={item.videoId}
              webViewStyle={{ backgroundColor: "#000" }}
              initialPlayerParams={{
                controls: true,
                modestbranding: true,
                rel: false,
                preventFullScreen: false,
              }}
            />
          ) : (
            <ThumbnailImage uri={item.thumbnail} width={width} height={playerHeight} />
          )}
        </View>

        <View style={styles.videoOverlay}>
          <Avatar photo={member.profileImage} size={40} />
          <View style={{ flex: 1 }}>
            <Text style={styles.memberName}>
              {member.firstName} {member.lastName}
            </Text>
            <Text style={styles.pageIndicator}>
              {index + 1} de {videos.length}
            </Text>
          </View>
          {isOwner && isActive && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item._id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Remover vídeo"
            >
              <Trash2 size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.container}>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color="#fff" size="large" />
          </View>
        ) : videos.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>
              Nenhum vídeo encontrado para este membro.
            </Text>
          </View>
        ) : (
          <FlatList
            data={videos}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            decelerationRate="fast"
            viewabilityConfigCallbackPairs={viewabilityCallbacks.current}
            getItemLayout={(_, index) => ({
              length: height,
              offset: height * index,
              index,
            })}
          />
        )}

        <SafeAreaView style={styles.topBar} edges={["top"]}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.backButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Voltar"
          >
            <ChevronLeft color="#fff" size={20} />
          </TouchableOpacity>
          <Text style={styles.topTitle} numberOfLines={1}>
            Vídeos de {member.firstName}
          </Text>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
