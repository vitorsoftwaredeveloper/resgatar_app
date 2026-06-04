import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { RemoveMemberSkeleton } from "@/components/Skeleton/RemoveMemberSkeleton";
import { SettingsMemberCard } from "@/components/SettingsMemberCard";
import { IMember } from "@/types/Member";
import { COLORS, SPACING } from "@/theme";

interface Props {
  members: IMember[];
  loading: boolean;
  onAction: (member: IMember) => void;
  iconAction: React.ReactElement;
  variant: "delete" | "edit";
}

const SKELETON_COUNT = 4;

export function MemberListWithSkeleton({
  members,
  loading,
  onAction,
  iconAction,
  variant,
}: Props) {
  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <FlatList
          data={loading ? Array.from({ length: SKELETON_COUNT }) : members}
          keyExtractor={(_, index) =>
            loading ? `skeleton-${index}` : members[index]._id
          }
          renderItem={({ item }: any) =>
            loading ? (
              <RemoveMemberSkeleton />
            ) : (
              <SettingsMemberCard
                member={item}
                onAction={onAction}
                iconAction={iconAction}
                variant={variant}
              />
            )
          }
          contentContainerStyle={styles.listContent}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000055",
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    marginTop: SPACING.xxs,
  },
  listContent: {
    gap: SPACING.sm2,
  },
});
