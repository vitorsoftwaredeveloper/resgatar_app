import { Avatar } from "@/components/Avatar";
import { Header } from "@/components/Header";
import { RemoveMemberSkeleton } from "@/components/Skeleton/RemoveMemberSkeleton";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { VideoService } from "@/services/VideoService";
import { IVideoMember } from "@/types/Video";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ChevronRight, Plus } from "lucide-react-native";
import React, { useCallback, useContext, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ModalAddVideo } from "./ModalAddVideo";
import { ModalVideoFeed } from "./ModalVideoFeed";
import { useStyles } from "./styles";

export function VideosScreen() {
  const navigation = useNavigation();
  const styles = useStyles();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { member } = useContext(AuthContext);

  const [members, setMembers] = useState<IVideoMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [addVideoVisible, setAddVideoVisible] = useState(false);
  const [feedMember, setFeedMember] = useState<IVideoMember | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await VideoService.listMembersWithVideos();
      setMembers(data);
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const renderItem = ({ item }: { item: IVideoMember }) => (
    <TouchableOpacity
      style={styles.memberCard}
      onPress={() => setFeedMember(item)}
      activeOpacity={0.75}
    >
      <Avatar photo={item.profileImage} size={48} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.videoCount}>
          {item.videoCount} {item.videoCount === 1 ? "vídeo" : "vídeos"}
        </Text>
      </View>
      <ChevronRight size={18} color={colors.textMuted} />
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
        <View style={styles.body}>
          {loading ? (
            <View style={styles.skeletonList}>
              {Array.from({ length: 5 }).map((_, index) => (
                <RemoveMemberSkeleton key={index} />
              ))}
            </View>
          ) : members.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>
                Nenhum membro publicou vídeos ainda.
              </Text>
            </View>
          ) : (
            <FlatList
              data={members}
              keyExtractor={(item) => item.memberId}
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

      {feedMember && (
        <ModalVideoFeed
          visible={!!feedMember}
          member={feedMember}
          onClose={() => setFeedMember(null)}
        />
      )}
    </View>
  );
}
